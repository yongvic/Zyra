import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { Couple, Game, GameScore } from '@prisma/client';
import { DEFAULT_DAILY_CHALLENGES, DEFAULT_GAME_QUESTIONS } from './content';

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}

  private async getMyCoupleOrThrow(userId: string): Promise<Couple> {
    const couple = await this.prisma.couple.findFirst({
      where: { OR: [{ userOneId: userId }, { userTwoId: userId }] },
    });
    if (!couple) {
      throw new NotFoundException('Couple not found for this user');
    }
    return couple;
  }

  private getPartnerId(couple: Couple, userId: string) {
    return couple.userOneId === userId ? couple.userTwoId : couple.userOneId;
  }

  private async ensureSeeded() {
    const qCount = await this.prisma.gameQuestion.count();
    if (qCount === 0) {
      await this.prisma.gameQuestion.createMany({
        data: DEFAULT_GAME_QUESTIONS.map((q) => ({
          type: q.type,
          mode: q.mode,
          prompt: q.prompt,
          options: q.options ?? undefined,
          answer: q.answer ?? undefined,
          tags: q.tags ?? [],
          isActive: true,
        })),
      });
    }

    const dCount = await this.prisma.dailyChallenge.count();
    if (dCount === 0) {
      await this.prisma.dailyChallenge.createMany({
        data: DEFAULT_DAILY_CHALLENGES.map((c) => ({
          mode: c.mode,
          challengeType: c.challengeType,
          prompt: c.prompt,
          tags: c.tags ?? [],
          isActive: true,
        })),
      });
    }
  }

  async createGame(coupleId: string, gameType: string, gameData: any): Promise<Game> {
    return this.prisma.game.create({
      data: {
        coupleId: coupleId,
        gameType: gameType,
        gameData: gameData,
      },
    });
  }

  async getGamesByCoupleId(coupleId: string): Promise<Game[]> {
    return this.prisma.game.findMany({
      where: { coupleId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateGameScore(coupleId: string, gameType: string, winnerId: string): Promise<GameScore> {
    // Prisma does not have a direct ON CONFLICT DO UPDATE equivalent for a single upsert
    // Need to find the score first, then update or create
    const existingScore = await this.prisma.gameScore.findFirst({
      where: {
        coupleId: coupleId,
        game: { gameType: gameType }, // Link to Game model
        playerId: winnerId,
      },
    });

    if (existingScore) {
      return this.prisma.gameScore.update({
        where: { id: existingScore.id },
        data: { score: { increment: 1 } },
      });
    } else {
      // Need to find a game of this type to link to the gameScore.
      // Assuming a game already exists for this couple and gameType
      const game = await this.prisma.game.findFirst({
        where: { coupleId: coupleId, gameType: gameType },
      });

      if (!game) {
        // Handle case where game doesn't exist, maybe create one?
        // For now, let's assume it should exist or throw an error.
        throw new Error(`Game of type ${gameType} not found for couple ${coupleId}`);
      }

      return this.prisma.gameScore.create({
        data: {
          coupleId: coupleId,
          gameId: game.id, // Link to the game
          playerId: winnerId,
          score: 1,
        },
      });
    }
  }

  async getScores(coupleId: string) {
    return this.prisma.gameScore.findMany({
      where: { coupleId },
      orderBy: { score: 'desc' },
      include: { player: { select: { id: true, name: true } } },
    });
  }

  async getRandomQuestion(type: string, mode: string = 'soft') {
    await this.ensureSeeded();

    const candidates = await this.prisma.gameQuestion.findMany({
      where: { type, mode, isActive: true },
      take: 50,
      orderBy: { createdAt: 'desc' },
    });
    if (!candidates.length) return null;
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  async getActiveSession(userId: string, gameType: string) {
    const couple = await this.getMyCoupleOrThrow(userId);
    return this.prisma.gameSession.findFirst({
      where: { coupleId: couple.id, gameType, status: 'active' },
      include: { moves: { orderBy: { moveIndex: 'asc' } } },
    });
  }

  async getOrCreateActiveSession(
    userId: string,
    gameType: string,
    config?: any,
  ) {
    const couple = await this.getMyCoupleOrThrow(userId);
    const existing = await this.prisma.gameSession.findFirst({
      where: { coupleId: couple.id, gameType, status: 'active' },
      include: { moves: { orderBy: { moveIndex: 'asc' } } },
    });
    if (existing) return existing;

    const partnerId = this.getPartnerId(couple, userId);
    const initial = this.buildInitialState(gameType, couple, userId, partnerId, config);

    return this.prisma.gameSession.create({
      data: {
        coupleId: couple.id,
        gameType,
        status: 'active',
        startedByUserId: userId,
        currentTurnUserId: initial.currentTurnUserId ?? userId,
        state: initial.state,
      },
      include: { moves: { orderBy: { moveIndex: 'asc' } } },
    });
  }

  async getSessionForUser(userId: string, sessionId: string) {
    const session = await this.prisma.gameSession.findUnique({
      where: { id: sessionId },
      include: { moves: { orderBy: { moveIndex: 'asc' } } },
    });
    if (!session) throw new NotFoundException('Session not found');

    const couple = await this.getMyCoupleOrThrow(userId);
    if (session.coupleId !== couple.id) {
      throw new ForbiddenException('Not allowed');
    }
    return session;
  }

  async addMoveToSession(
    userId: string,
    sessionId: string,
    moveType: string,
    moveData?: any,
  ) {
    const session = await this.getSessionForUser(userId, sessionId);
    if (session.status !== 'active') {
      throw new BadRequestException('Session is not active');
    }

    const couple = await this.getMyCoupleOrThrow(userId);
    const partnerId = this.getPartnerId(couple, userId);

    const max = await this.prisma.gameMove.aggregate({
      where: { sessionId },
      _max: { moveIndex: true },
    });
    const nextIndex = (max._max.moveIndex ?? 0) + 1;

    await this.prisma.gameMove.create({
      data: {
        sessionId,
        userId,
        moveIndex: nextIndex,
        moveType,
        moveData: moveData ?? undefined,
      },
    });

    const applied = this.applyMove(
      session.gameType,
      (session.state as any) ?? {},
      { userId, moveType, moveData },
      { couple, partnerId },
    );

    const updated = await this.prisma.gameSession.update({
      where: { id: sessionId },
      data: {
        state: applied.state,
        currentTurnUserId: applied.currentTurnUserId ?? session.currentTurnUserId,
        status: applied.status ?? session.status,
        winnerUserId: applied.winnerUserId ?? session.winnerUserId,
        endedAt: applied.endedAt ?? session.endedAt,
      },
      include: { moves: { orderBy: { moveIndex: 'asc' } } },
    });

    // Update global score if completed with a winner
    if (updated.status === 'completed' && updated.winnerUserId) {
      await this.ensureGameExistsForScore(updated.coupleId, updated.gameType);
      await this.updateGameScore(updated.coupleId, updated.gameType, updated.winnerUserId);
    }

    return updated;
  }

  private async ensureGameExistsForScore(coupleId: string, gameType: string) {
    const existing = await this.prisma.game.findFirst({ where: { coupleId, gameType } });
    if (existing) return existing;
    return this.prisma.game.create({
      data: { coupleId, gameType, gameData: {} },
    });
  }

  async completeSession(userId: string, sessionId: string, winnerUserId?: string | null) {
    const session = await this.getSessionForUser(userId, sessionId);
    if (session.status !== 'active') return session;

    const couple = await this.getMyCoupleOrThrow(userId);
    const allowedWinner =
      !winnerUserId ||
      winnerUserId === couple.userOneId ||
      winnerUserId === couple.userTwoId;
    if (!allowedWinner) throw new BadRequestException('Invalid winner');

    const updated = await this.prisma.gameSession.update({
      where: { id: sessionId },
      data: {
        status: 'completed',
        endedAt: new Date(),
        winnerUserId: winnerUserId ?? null,
      },
      include: { moves: { orderBy: { moveIndex: 'asc' } } },
    });

    if (updated.winnerUserId) {
      await this.ensureGameExistsForScore(updated.coupleId, updated.gameType);
      await this.updateGameScore(updated.coupleId, updated.gameType, updated.winnerUserId);
    }

    return updated;
  }

  private buildInitialState(
    gameType: string,
    couple: Couple,
    userId: string,
    partnerId: string,
    config?: any,
  ): { currentTurnUserId?: string; state: any } {
    if (gameType === 'memory') {
      const gridSize = (config?.gridSize === 6 ? 6 : 4) as 4 | 6;
      const totalCards = gridSize * gridSize;
      const totalPairs = totalCards / 2;

      const pairIds = Array.from({ length: totalPairs }, (_, i) => i + 1);
      const deck = shuffle(
        pairIds.flatMap((pairId) => [
          { pairId, assetKey: `pair-${pairId}` },
          { pairId, assetKey: `pair-${pairId}` },
        ]),
      ).map((c, index) => ({ ...c, index }));

      return {
        currentTurnUserId: userId,
        state: {
          gridSize,
          deck,
          selectedIndices: [],
          matchedPairIds: [],
          matchesByUserId: { [userId]: 0, [partnerId]: 0 },
          attemptsByUserId: { [userId]: 0, [partnerId]: 0 },
        },
      };
    }

    if (gameType === 'more_less' || gameType === 'more-less') {
      return {
        currentTurnUserId: userId,
        state: {
          secret: Math.floor(Math.random() * 100) + 1,
          lastGuess: null,
          hint: null,
          attemptsByUserId: { [userId]: 0, [partnerId]: 0 },
        },
      };
    }

    // Default state
    return {
      currentTurnUserId: userId,
      state: {
        mode: config?.mode || 'soft',
        hotConsents: { [couple.userOneId]: false, [couple.userTwoId]: false },
        lastCard: null,
      },
    };
  }

  private applyMove(
    gameType: string,
    state: any,
    move: { userId: string; moveType: string; moveData?: any },
    ctx: { couple: Couple; partnerId: string },
  ): { state: any; currentTurnUserId?: string; status?: string; winnerUserId?: string; endedAt?: Date } {
    if (gameType === 'memory') {
      return this.applyMemoryMove(state, move, ctx);
    }
    if (gameType === 'more_less' || gameType === 'more-less') {
      return this.applyMoreLessMove(state, move, ctx);
    }

    // Generic: allow setting mode / consenting / storing lastCard / answering.
    const next = { ...(state ?? {}) };
    if (move.moveType === 'set_mode') {
      next.mode = move.moveData?.mode || 'soft';
    }
    if (move.moveType === 'consent_hot') {
      const consents = { ...(next.hotConsents || {}) };
      consents[move.userId] = !!move.moveData?.value;
      next.hotConsents = consents;
    }
    if (move.moveType === 'draw_card') {
      next.lastCard = move.moveData || null;
    }
    if (move.moveType === 'answer') {
      next.answers = next.answers || {};
      next.answers[move.userId] = [...(next.answers[move.userId] || []), move.moveData];
    }

    return { state: next };
  }

  private applyMemoryMove(
    state: any,
    move: { userId: string; moveType: string; moveData?: any },
    ctx: { couple: Couple; partnerId: string },
  ) {
    const s = { ...(state ?? {}) };
    const deck: Array<{ index: number; pairId: number }> = s.deck || [];
    const gridSize = s.gridSize || 4;
    const totalPairs = (gridSize * gridSize) / 2;

    const currentTurnUserId: string = s.currentTurnUserId || ctx.couple.userOneId;
    if (move.userId !== currentTurnUserId) {
      throw new ForbiddenException("Ce n'est pas ton tour");
    }

    if (move.moveType !== 'flip') {
      return { state: s, currentTurnUserId };
    }

    const index = Number(move.moveData?.index);
    if (!Number.isFinite(index)) throw new BadRequestException('Invalid index');
    const card = deck.find((c) => c.index === index);
    if (!card) throw new BadRequestException('Card not found');

    const matchedPairIds: number[] = s.matchedPairIds || [];
    if (matchedPairIds.includes(card.pairId)) {
      throw new BadRequestException('Already matched');
    }

    const selectedIndices: number[] = s.selectedIndices || [];
    if (selectedIndices.includes(index)) {
      throw new BadRequestException('Already selected');
    }

    const nextSelected = [...selectedIndices, index];
    s.selectedIndices = nextSelected;

    if (nextSelected.length < 2) {
      s.currentTurnUserId = currentTurnUserId;
      return { state: s, currentTurnUserId };
    }

    // Two cards selected: resolve
    const [i1, i2] = nextSelected;
    const c1 = deck.find((c) => c.index === i1)!;
    const c2 = deck.find((c) => c.index === i2)!;

    const attemptsByUserId = { ...(s.attemptsByUserId || {}) };
    const matchesByUserId = { ...(s.matchesByUserId || {}) };
    attemptsByUserId[currentTurnUserId] = (attemptsByUserId[currentTurnUserId] || 0) + 1;

    if (c1.pairId === c2.pairId) {
      s.matchedPairIds = [...matchedPairIds, c1.pairId];
      matchesByUserId[currentTurnUserId] = (matchesByUserId[currentTurnUserId] || 0) + 1;
      // keep turn on match
      s.currentTurnUserId = currentTurnUserId;
    } else {
      // switch turn on miss
      s.currentTurnUserId = ctx.partnerId;
    }

    s.attemptsByUserId = attemptsByUserId;
    s.matchesByUserId = matchesByUserId;
    s.selectedIndices = [];

    if ((s.matchedPairIds || []).length >= totalPairs) {
      // Determine winner by matches
      const u1 = ctx.couple.userOneId;
      const u2 = ctx.couple.userTwoId;
      const m1 = matchesByUserId[u1] || 0;
      const m2 = matchesByUserId[u2] || 0;
      const winnerUserId = m1 === m2 ? undefined : m1 > m2 ? u1 : u2;
      return {
        state: s,
        currentTurnUserId: s.currentTurnUserId,
        status: 'completed',
        winnerUserId,
        endedAt: new Date(),
      };
    }

    return { state: s, currentTurnUserId: s.currentTurnUserId };
  }

  private applyMoreLessMove(
    state: any,
    move: { userId: string; moveType: string; moveData?: any },
    ctx: { couple: Couple; partnerId: string },
  ) {
    const s = { ...(state ?? {}) };
    if (move.moveType !== 'guess') return { state: s };

    const guess = Number(move.moveData?.guess);
    if (!Number.isFinite(guess)) throw new BadRequestException('Invalid guess');

    const secret = Number(s.secret);
    if (!Number.isFinite(secret)) throw new BadRequestException('Secret missing');

    const attemptsByUserId = { ...(s.attemptsByUserId || {}) };
    attemptsByUserId[move.userId] = (attemptsByUserId[move.userId] || 0) + 1;
    s.attemptsByUserId = attemptsByUserId;
    s.lastGuess = guess;

    if (guess === secret) {
      s.hint = 'Bravo 🎯';
      return {
        state: s,
        status: 'completed',
        winnerUserId: move.userId,
        endedAt: new Date(),
      };
    }

    s.hint = guess < secret ? 'Plus' : 'Moins';
    return { state: s };
  }

  // ===== Daily challenge =====

  async getTodayDailyChallenge(userId: string, mode: string = 'soft') {
    await this.ensureSeeded();
    const couple = await this.getMyCoupleOrThrow(userId);

    const day = startOfDay(new Date());
    const expiresAt = addDays(day, 1);

    let assignment = await this.prisma.dailyChallengeAssignment.findUnique({
      where: { coupleId_day: { coupleId: couple.id, day } },
      include: { challenge: true, completions: true },
    });

    if (!assignment) {
      const challenges = await this.prisma.dailyChallenge.findMany({
        where: { isActive: true, mode },
        take: 50,
      });
      if (!challenges.length) {
        throw new NotFoundException('No daily challenges available');
      }
      const chosen = challenges[Math.floor(Math.random() * challenges.length)];
      assignment = await this.prisma.dailyChallengeAssignment.create({
        data: {
          coupleId: couple.id,
          challengeId: chosen.id,
          day,
          expiresAt,
        },
        include: { challenge: true, completions: true },
      });
    }

    return assignment;
  }

  async submitTodayDailyChallenge(userId: string, payload: any, mode: string = 'soft') {
    const assignment = await this.getTodayDailyChallenge(userId, mode);
    return this.prisma.dailyChallengeCompletion.upsert({
      where: { assignmentId_userId: { assignmentId: assignment.id, userId } },
      create: {
        assignmentId: assignment.id,
        userId,
        payload: payload ?? undefined,
      },
      update: {
        payload: payload ?? undefined,
        submittedAt: new Date(),
      },
    });
  }

  async validateDailyChallengeCompletion(userId: string, completionId: string) {
    const completion = await this.prisma.dailyChallengeCompletion.findUnique({
      where: { id: completionId },
      include: { assignment: { include: { couple: true } } },
    });
    if (!completion) throw new NotFoundException('Completion not found');

    const couple = completion.assignment.couple;
    const isMember = couple.userOneId === userId || couple.userTwoId === userId;
    if (!isMember) throw new ForbiddenException('Not allowed');
    if (completion.userId === userId) {
      throw new BadRequestException('You cannot validate your own completion');
    }

    return this.prisma.dailyChallengeCompletion.update({
      where: { id: completionId },
      data: { validatedAt: new Date() },
    });
  }
}
