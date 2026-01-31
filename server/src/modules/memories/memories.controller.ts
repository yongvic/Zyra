import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MemoriesService } from './memories.service';

@Controller('memories')
@UseGuards(AuthGuard('jwt'))
export class MemoriesController {
  constructor(private readonly memoriesService: MemoriesService) {}

  @Post()
  async createMemory(@Req() req: any, @Body() body: any) {
    return this.memoriesService.createMemory(
      body.coupleId,
      req.user.id,
      body.title,
      body.description,
      body.imageUrl,
      body.category,
    );
  }

  @Get('couple/:coupleId')
  async getMemoriesByCouple(@Param('coupleId') coupleId: string) {
    return this.memoriesService.getMemoriesByCoupleId(coupleId);
  }

  @Get(':id')
  async getMemory(@Param('id') id: string) {
    return this.memoriesService.getMemoryById(id);
  }

  @Put(':id')
  async updateMemory(@Param('id') id: string, @Body() body: any) {
    return this.memoriesService.updateMemory(id, body);
  }

  @Delete(':id')
  async deleteMemory(@Param('id') id: string) {
    return this.memoriesService.deleteMemory(id);
  }

  @Post('playlist')
  async createPlaylist(@Req() req: any, @Body() body: any) {
    return this.memoriesService.createPlaylist(
      body.coupleId,
      body.title ?? body.name,
      body.description,
      req.user.id,
    );
  }

  @Get('playlists/:coupleId')
  async getPlaylists(@Param('coupleId') coupleId: string) {
    return this.memoriesService.getPlaylistsByCoupleId(coupleId);
  }

  @Post('playlist/:playlistId/song')
  async addSongToPlaylist(
    @Req() req: any,
    @Param('playlistId') playlistId: string,
    @Body() body: { songUrl: string; title?: string; artist?: string },
  ) {
    return this.memoriesService.addSongToPlaylist(
      playlistId,
      body.songUrl,
      req.user.id,
      { title: body.title, artist: body.artist },
    );
  }

  @Get('playlist/:playlistId/songs')
  async getPlaylistSongs(@Param('playlistId') playlistId: string) {
    return this.memoriesService.getSongsByPlaylistId(playlistId);
  }

  @Delete('playlist/song/:songId')
  async deletePlaylistSong(@Param('songId') songId: string) {
    return this.memoriesService.deleteSongFromPlaylist(songId);
  }
}
