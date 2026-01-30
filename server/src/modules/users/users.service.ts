import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class UsersService {
  constructor(private database: DatabaseService) {}

  async create(userData: {
    email: string;
    password?: string;
    name: string;
    provider: string;
    googleId?: string;
  }) {
    const result = await this.database.query(
      `INSERT INTO users (email, password, name, provider, google_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, name, provider, created_at`,
      [userData.email, userData.password || null, userData.name, userData.provider, userData.googleId || null],
    );
    return result.rows[0];
  }

  async findById(id: string) {
    const result = await this.database.query(
      'SELECT id, email, name, provider, created_at FROM users WHERE id = $1',
      [id],
    );
    return result.rows[0] || null;
  }

  async findByEmail(email: string) {
    const result = await this.database.query(
      'SELECT * FROM users WHERE email = $1',
      [email],
    );
    return result.rows[0] || null;
  }

  async update(id: string, userData: any) {
    const fields = Object.keys(userData)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const result = await this.database.query(
      `UPDATE users SET ${fields}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id, ...Object.values(userData)],
    );
    return result.rows[0];
  }

  async findAll() {
    const result = await this.database.query(
      'SELECT id, email, name, provider, created_at FROM users',
    );
    return result.rows;
  }
}
