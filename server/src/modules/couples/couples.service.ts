import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class CouplesService {
  constructor(private database: DatabaseService) {}

  async createCouple(userId1: string, userId2: string, coupleName: string) {
    const result = await this.database.query(
      `INSERT INTO couples (user1_id, user2_id, name)
       VALUES ($1, $2, $3)
       RETURNING id, user1_id, user2_id, name, created_at`,
      [userId1, userId2, coupleName],
    );
    return result.rows[0];
  }

  async getCoupleByUserId(userId: string) {
    const result = await this.database.query(
      `SELECT * FROM couples WHERE user1_id = $1 OR user2_id = $1`,
      [userId],
    );
    return result.rows[0] || null;
  }

  async getCoupleById(coupleId: string) {
    const result = await this.database.query(
      'SELECT * FROM couples WHERE id = $1',
      [coupleId],
    );
    return result.rows[0] || null;
  }

  async updateCouple(coupleId: string, data: any) {
    const fields = Object.keys(data)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const result = await this.database.query(
      `UPDATE couples SET ${fields}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [coupleId, ...Object.values(data)],
    );
    return result.rows[0];
  }
}
