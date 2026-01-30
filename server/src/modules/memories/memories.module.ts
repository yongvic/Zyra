import { Module } from '@nestjs/common';
import { MemoriesController } from './memories.controller';
import { MemoriesService } from './memories.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [MemoriesController],
  providers: [MemoriesService],
  exports: [MemoriesService],
})
export class MemoriesModule {}
