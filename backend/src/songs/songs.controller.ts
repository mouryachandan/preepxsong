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
    { name: 'audio', maxCount: 30 },
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

  @Get('play/audio')
  async proxyAudio(@Query('url') audioUrl: string, @Req() req: any, @Res() res: any) {
    if (!audioUrl) return res.status(400).send('No URL');
    try {
      const axios = require('axios');
      const headers: any = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        'Referer': 'https://www.jiosaavn.com/',
      };
      if (req.headers.range) {
        headers['Range'] = req.headers.range;
      }
      const response = await axios.get(audioUrl, {
        responseType: 'stream',
        headers,
        validateStatus: () => true
      });
      res.status(response.status);
      Object.keys(response.headers).forEach((key) => {
        res.setHeader(key, response.headers[key]);
      });
      response.data.pipe(res);
    } catch (error) {
      res.status(500).send('Error proxying audio');
    }
  }
}
