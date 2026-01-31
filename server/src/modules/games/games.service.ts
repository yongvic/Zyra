import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Import PrismaService
import { Game, GameScore } from '@prisma/client'; // Import model types

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {} // Inject PrismaService

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

  async getScores(coupleId: string): Promise<GameScore[]> {
    return this.prisma.gameScore.findMany({
      where: { coupleId },
      orderBy: { score: 'desc' },
    });
  }

  // TODO: The `questions` table is not defined in schema.prisma.
  // This method will not work until a Question model is added to schema.prisma
  // and the corresponding table exists in the database.
  async getRandomQuestion(questionType: string): Promise<any | null> {
    console.warn(`Attempted to call getRandomQuestion for type "${questionType}", but 'questions' table is not defined in Prisma schema.`);
    // Temporarily returning null or throwing an error
    // return this.prisma.questions.findFirst({ // This would cause a type error
    //   where: { type: questionType, isActive: true },
    //   orderBy: { RANDOM: 'asc' }, // RANDOM() is database-specific, Prisma has no direct equivalent
    // });
    return null; // Placeholder until Question model is defined
  }
}
