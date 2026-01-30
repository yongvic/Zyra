import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MemoriesService } from './memories.service';

@Controller('memories')
@UseGuards(AuthGuard('jwt'))
export class MemoriesController {
  constructor(private readonly memoriesService: MemoriesService) {}

  @Post()
  async createMemory(body: any) {
    return this.memoriesService.createMemory(
      body.coupleId,
      body.createdBy,
      body.title,
      body.description,
      body.imageUrl,
      body.category,
    );
  }

  @Get('couple/:coupleId')
  async getMemoriesByCouple(coupleId: string) {
    return this.memoriesService.getMemoriesByCoupleId(coupleId);
  }

  @Get(':id')
  async getMemory(id: string) {
    return this.memoriesService.getMemoryById(id);
  }

  @Put(':id')
  async updateMemory(id: string, body: any) {
    return this.memoriesService.updateMemory(id, body);
  }

  @Delete(':id')
  async deleteMemory(id: string) {
    return this.memoriesService.deleteMemory(id);
  }

  @Post('playlist')
  async createPlaylist(body: any) {
    return this.memoriesService.createPlaylist(
      body.coupleId,
      body.name,
      body.description,
    );
  }

  @Get('playlists/:coupleId')
  async getPlaylists(coupleId: string) {
    return this.memoriesService.getPlaylistsByCoupleId(coupleId);
  }

  @Post('playlist/:playlistId/song')
  async addSongToPlaylist(playlistId: string, body: { songUrl: string }) {
    return this.memoriesService.addSongToPlaylist(playlistId, body.songUrl);
  }
}
