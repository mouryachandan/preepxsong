import { Controller, Get, Query, Param, Req, Res, Post, UseInterceptors, UploadedFiles, Body, Delete, Ip } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { SongsService } from './songs.service';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  private activeUsers = new Map<string, number>();

  @Post('ping')
  pingUser(@Ip() ip: string, @Body('clientId') clientId: string) {
    const now = Date.now();
    const id = clientId || ip || Math.random().toString();
    this.activeUsers.set(id, now);
    
    // Clean up users older than 15 seconds
    for (const [key, time] of this.activeUsers.entries()) {
      if (now - time > 15000) {
        this.activeUsers.delete(key);
      }
    }
    
    return { online: Math.max(1, this.activeUsers.size) };
  }

  @Get()
  async getAllSongs() {
    return this.songsService.getTrending();
  }

  @Get('all')
  async getAllSongsList() {
    return this.songsService.getAllSongs();
  }

  @Get('trending')
  async getTrending() {
    return this.songsService.getTrending();
  }

  @Get('search')
  async searchSongs(@Query('q') q: string) {
    if (!q) {
      return { success: false, data: [] };
    }
    return this.songsService.searchSongs(q);
  }

  @Get('artist/:name')
  async getArtistSongs(@Param('name') name: string) {
    return this.songsService.getArtistSongs(name);
  }

  @Get(':id')
  async getSongById(@Param('id') id: string) {
    return this.songsService.getSongById(id);
  }

  @Post('upload')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'audio', maxCount: 5 }, // Reduced from 30 to prevent OOM
    { name: 'image', maxCount: 1 },
  ]))
  async uploadSong(
    @UploadedFiles() files: { audio?: any[], image?: any[] },
    @Body() body: { artists: string }
  ) {
    return this.songsService.uploadSong(files, body);
  }

  @Delete(':id')
  async deleteSong(@Param('id') id: string) {
    return this.songsService.deleteSong(id);
  }


}
