import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GamesService } from './games.service';

@Controller('games')
@UseGuards(AuthGuard('jwt'))
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  // ===== Sessions (playable games state) =====

  @Post('sessions')
  async createSession(
    @Req() req: any,
    @Body() body: { gameType: string; config?: any },
  ) {
    return this.gamesService.getOrCreateActiveSession(req.user.id, body.gameType, body.config);
  }

  @Get('sessions/active/:gameType')
  async getActiveSession(@Req() req: any, @Param('gameType') gameType: string) {
    return this.gamesService.getActiveSession(req.user.id, gameType);
  }

  @Get('sessions/:id')
  async getSession(@Req() req: any, @Param('id') id: string) {
    return this.gamesService.getSessionForUser(req.user.id, id);
  }

  @Post('sessions/:id/moves')
  async addMove(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { moveType: string; moveData?: any },
  ) {
    return this.gamesService.addMoveToSession(req.user.id, id, body.moveType, body.moveData);
  }

  @Post('sessions/:id/complete')
  async complete(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { winnerUserId?: string | null },
  ) {
    return this.gamesService.completeSession(req.user.id, id, body.winnerUserId ?? null);
  }

  @Post()
  async createGame(
    @Body() body: { coupleId: string; gameType: string; gameData: any },
  ) {
    return this.gamesService.createGame(body.coupleId, body.gameType, body.gameData);
  }

  @Get('couple/:coupleId')
  async getGamesByCouple(@Param('coupleId') coupleId: string) {
    return this.gamesService.getGamesByCoupleId(coupleId);
  }

  @Post('score')
  async updateScore(
    @Body() body: { coupleId: string; gameType: string; winnerId: string },
  ) {
    return this.gamesService.updateGameScore(body.coupleId, body.gameType, body.winnerId);
  }

  @Get('scores/:coupleId')
  async getScores(@Param('coupleId') coupleId: string) {
    return this.gamesService.getScores(coupleId);
  }

  // ===== Questions =====

  @Get('questions/random')
  async getQuestion(
    @Query('type') type: string,
    @Query('mode') mode?: string,
  ) {
    return this.gamesService.getRandomQuestion(type, mode || 'soft');
  }

  // ===== Daily challenge =====

  @Get('daily/today')
  async getDailyToday(@Req() req: any, @Query('mode') mode?: string) {
    return this.gamesService.getTodayDailyChallenge(req.user.id, mode || 'soft');
  }

  @Post('daily/today/submit')
  async submitDailyToday(@Req() req: any, @Body() body: { payload?: any; mode?: string }) {
    return this.gamesService.submitTodayDailyChallenge(req.user.id, body.payload, body.mode || 'soft');
  }

  @Post('daily/completions/:id/validate')
  async validateDaily(@Req() req: any, @Param('id') id: string) {
    return this.gamesService.validateDailyChallengeCompletion(req.user.id, id);
  }
}
