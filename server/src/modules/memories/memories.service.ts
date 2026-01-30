import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class MemoriesService {
  constructor(private database: DatabaseService) {}

  async createMemory(
    coupleId: string,
    createdBy: string,
    title: string,
    description: string,
    imageUrl?: string,
    category?: string,
  ) {
    const result = await this.database.query(
      `INSERT INTO memories (couple_id, created_by, title, description, image_url, category)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, couple_id, created_by, title, description, image_url, category, created_at`,
      [coupleId, createdBy, title, description, imageUrl || null, category || 'general'],
    );
    return result.rows[0];
  }

  async getMemoriesByCoupleId(coupleId: string) {
    const result = await this.database.query(
      'SELECT * FROM memories WHERE couple_id = $1 ORDER BY created_at DESC',
      [coupleId],
    );
    return result.rows;
  }

  async getMemoryById(memoryId: string) {
    const result = await this.database.query(
      'SELECT * FROM memories WHERE id = $1',
      [memoryId],
    );
    return result.rows[0] || null;
  }

  async updateMemory(memoryId: string, data: any) {
    const fields = Object.keys(data)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const result = await this.database.query(
      `UPDATE memories SET ${fields}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [memoryId, ...Object.values(data)],
    );
    return result.rows[0];
  }

  async deleteMemory(memoryId: string) {
    await this.database.query('DELETE FROM memories WHERE id = $1', [memoryId]);
  }

  async createPlaylist(
    coupleId: string,
    name: string,
    description?: string,
  ) {
    const result = await this.database.query(
      `INSERT INTO playlists (couple_id, name, description)
       VALUES ($1, $2, $3)
       RETURNING id, couple_id, name, description, created_at`,
      [coupleId, name, description || null],
    );
    return result.rows[0];
  }

  async getPlaylistsByCoupleId(coupleId: string) {
    const result = await this.database.query(
      'SELECT * FROM playlists WHERE couple_id = $1 ORDER BY created_at DESC',
      [coupleId],
    );
    return result.rows;
  }

  async addSongToPlaylist(playlistId: string, songUrl: string) {
    const result = await this.database.query(
      `INSERT INTO playlist_songs (playlist_id, song_url)
       VALUES ($1, $2)
       RETURNING id, playlist_id, song_url, created_at`,
      [playlistId, songUrl],
    );
    return result.rows[0];
  }
}
