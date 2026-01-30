import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GamesService } from './games.service';

@Controller('games')
@UseGuards(AuthGuard('jwt'))
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  async createGame(body: { coupleId: string; gameType: string; gameData: any }) {
    return this.gamesService.createGame(body.coupleId, body.gameType, body.gameData);
  }

  @Get('couple/:coupleId')
  async getGamesByCouple(coupleId: string) {
    return this.gamesService.getGamesByCoupleId(coupleId);
  }

  @Post('score')
  async updateScore(body: { coupleId: string; gameType: string; winnerId: string }) {
    return this.gamesService.updateGameScore(body.coupleId, body.gameType, body.winnerId);
  }

  @Get('scores/:coupleId')
  async getScores(coupleId: string) {
    return this.gamesService.getScores(coupleId);
  }

  @Get('question/:questionType')
  async getQuestion(questionType: string) {
    return this.gamesService.getRandomQuestion(questionType);
  }
}
