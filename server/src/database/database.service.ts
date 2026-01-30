import { Injectable } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';

@Injectable()
export class DatabaseService {
  private pool: Pool;

  constructor(databasePool: Pool) {
    this.pool = databasePool;
  }

  async query(text: string, params?: any[]): Promise<QueryResult> {
    return this.pool.query(text, params);
  }

  async transaction<T>(
    callback: (client: any) => Promise<T>,
  ): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
