import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class ChatService {
  constructor(private database: DatabaseService) {}

  async saveMessage(
    coupleId: string,
    senderId: string,
    message: string,
    messageType: string = 'text',
  ) {
    const result = await this.database.query(
      `INSERT INTO chat_messages (couple_id, sender_id, content, message_type)
       VALUES ($1, $2, $3, $4)
       RETURNING id, couple_id, sender_id, content, message_type, created_at`,
      [coupleId, senderId, message, messageType],
    );
    return result.rows[0];
  }

  async getMessages(coupleId: string, limit: number = 50) {
    const result = await this.database.query(
      `SELECT * FROM chat_messages WHERE couple_id = $1 
       ORDER BY created_at DESC LIMIT $2`,
      [coupleId, limit],
    );
    return result.rows.reverse();
  }

  async deleteMessage(messageId: string) {
    await this.database.query(
      'DELETE FROM chat_messages WHERE id = $1',
      [messageId],
    );
  }
}
