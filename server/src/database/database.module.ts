import { Module } from '@nestjs/common';
import { Pool } from 'pg';
import { DatabaseService } from './database.service';

@Module({
  providers: [
    {
      provide: 'DATABASE_POOL',
      useFactory: () => {
        const pool = new Pool({
          connectionString: process.env.DATABASE_URL,
        });

        pool.on('error', (err) => {
          console.error('Unexpected error on idle client', err);
        });

        return pool;
      },
    },
    DatabaseService,
  ],
  exports: [DatabaseService, 'DATABASE_POOL'],
})
export class DatabaseModule {}
