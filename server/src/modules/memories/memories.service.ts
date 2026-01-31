import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Import PrismaService
import { Memory, Playlist, PlaylistSong } from '@prisma/client'; // Import model types

@Injectable()
export class MemoriesService {
  constructor(private prisma: PrismaService) {} // Inject PrismaService

  async createMemory(
    coupleId: string,
    creatorId: string, // Changed from createdBy to creatorId
    title: string,
    description: string,
    imageUrl?: string, // This will be mapped to mediaUrls
    category?: string, // This will be mapped to tags
  ): Promise<Memory> {
    return this.prisma.memory.create({
      data: {
        coupleId: coupleId,
        creatorId: creatorId,
        title: title,
        description: description,
        mediaUrls: imageUrl ? [imageUrl] : [], // Map single imageUrl to array
        tags: category ? [category] : [], // Map single category to array
        memoryDate: new Date(), // Defaulting as not provided in initial request
      },
    });
  }

  async getMemoriesByCoupleId(coupleId: string): Promise<Memory[]> {
    return this.prisma.memory.findMany({
      where: { coupleId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMemoryById(memoryId: string): Promise<Memory | null> {
    return this.prisma.memory.findUnique({
      where: { id: memoryId },
    });
  }

  async updateMemory(memoryId: string, data: any): Promise<Memory> {
    // Adjust data to match Prisma schema if necessary (e.g. imageUrl -> mediaUrls)
    const updateData: any = { ...data };
    if (updateData.imageUrl !== undefined) {
      updateData.mediaUrls = updateData.imageUrl ? [updateData.imageUrl] : [];
      delete updateData.imageUrl;
    }
    if (updateData.category !== undefined) {
      updateData.tags = updateData.category ? [updateData.category] : [];
      delete updateData.category;
    }

    return this.prisma.memory.update({
      where: { id: memoryId },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });
  }

  async deleteMemory(memoryId: string): Promise<Memory> {
    return this.prisma.memory.delete({
      where: { id: memoryId },
    });
  }

  async createPlaylist(
    coupleId: string,
    title: string, // Changed from name to title
    description?: string,
    createdBy?: string, // Add createdBy parameter as per schema
  ): Promise<Playlist> {
    if (!createdBy) {
      throw new BadRequestException('createdBy is required');
    }
    return this.prisma.playlist.create({
      data: {
        coupleId: coupleId,
        title: title,
        description: description,
        createdBy,
      },
    });
  }

  async getPlaylistsByCoupleId(coupleId: string): Promise<Playlist[]> {
    return this.prisma.playlist.findMany({
      where: { coupleId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addSongToPlaylist(
    playlistId: string,
    songUrl: string,
    addedBy: string,
    meta?: { title?: string; artist?: string },
  ): Promise<PlaylistSong> {
    // This assumes some external service would parse songUrl to get title, artist, etc.
    // For now, we'll use placeholder values if not provided.
    // The previous frontend passed title/artist as formData, not just songUrl.
    // The current backend schema for PlaylistSong has `songTitle`, `artistName`, `albumName`, `durationMs`, `spotifyId`.
    // We need more data than just songUrl to create a complete PlaylistSong entry in the DB.
    // For now, I'll use placeholders for required fields and just the URL for spotifyId.
    return this.prisma.playlistSong.create({
      data: {
        playlistId: playlistId,
        songTitle: meta?.title?.trim() || 'Unknown Title',
        artistName: meta?.artist?.trim() || 'Unknown Artist',
        spotifyId: songUrl, // Assuming songUrl can be used as a pseudo-spotifyId or an actual spotify ID
        addedBy: addedBy,
      },
    });
  }

  async getSongsByPlaylistId(playlistId: string): Promise<PlaylistSong[]> {
    return this.prisma.playlistSong.findMany({
      where: { playlistId },
      orderBy: { addedAt: 'desc' },
    });
  }

  async deleteSongFromPlaylist(songId: string): Promise<PlaylistSong> {
    return this.prisma.playlistSong.delete({
      where: { id: songId },
    });
  }
}
