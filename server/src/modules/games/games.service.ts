import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class GamesService {
  constructor(private database: DatabaseService) {}

  async createGame(coupleId: string, gameType: string, gameData: any) {
    const result = await this.database.query(
      `INSERT INTO games (couple_id, game_type, data)
       VALUES ($1, $2, $3)
       RETURNING id, couple_id, game_type, data, created_at`,
      [coupleId, gameType, JSON.stringify(gameData)],
    );
    return result.rows[0];
  }

  async getGamesByCoupleId(coupleId: string) {
    const result = await this.database.query(
      'SELECT * FROM games WHERE couple_id = $1 ORDER BY created_at DESC',
      [coupleId],
    );
    return result.rows;
  }

  async updateGameScore(coupleId: string, gameType: string, winnerId: string) {
    const result = await this.database.query(
      `INSERT INTO game_scores (couple_id, game_type, winner_id, score)
       VALUES ($1, $2, $3, 1)
       ON CONFLICT (couple_id, game_type, winner_id) 
       DO UPDATE SET score = game_scores.score + 1
       RETURNING *`,
      [coupleId, gameType, winnerId],
    );
    return result.rows[0];
  }

  async getScores(coupleId: string) {
    const result = await this.database.query(
      'SELECT * FROM game_scores WHERE couple_id = $1 ORDER BY score DESC',
      [coupleId],
    );
    return result.rows;
  }

  async getRandomQuestion(questionType: string) {
    const result = await this.database.query(
      `SELECT * FROM questions WHERE type = $1 AND is_active = true
       ORDER BY RANDOM() LIMIT 1`,
      [questionType],
    );
    return result.rows[0] || null;
  }
}
