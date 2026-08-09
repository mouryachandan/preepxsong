import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Song, SongDocument } from './schemas/song.schema';
import cloudinary from '../config/cloudinary.config';

@Injectable()
export class SongsService {
  constructor(@InjectModel(Song.name) private songModel: Model<SongDocument>) {}

  private async uploadToCloudinary(fileBuffer: Buffer, resourceType: 'auto' | 'video' | 'image', folder: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: resourceType, folder: folder },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );
      uploadStream.end(fileBuffer);
    });
  }

  async uploadSong(files: { audio?: any[], image?: any[] }, body: { artists: string }) {
    if (!files.audio || files.audio.length === 0) {
      throw new BadRequestException('Audio file(s) are required');
    }

    const imageFile = files.image ? files.image[0] : null;

    try {
      const imageUrl = imageFile 
        ? await this.uploadToCloudinary(imageFile.buffer, 'image', 'songs_images')
        : 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2000&auto=format&fit=crop';

      const uploadPromises = files.audio.map(async (audioFile) => {
        const audioUrl = await this.uploadToCloudinary(audioFile.buffer, 'video', 'songs_audio');
        
        // Strip .mp3 extension for title
        let title = audioFile.originalname || 'Unknown Title';
        title = title.replace(/\.mp3$/i, '');

        const newSong = new this.songModel({
          title: title,
          artists: body.artists || 'Unknown Artist',
          audioUrl,
          imageUrl,
        });

        return newSong.save();
      });

      const savedSongs = await Promise.all(uploadPromises);
      return { success: true, message: `${savedSongs.length} song(s) uploaded successfully`, data: savedSongs };
    } catch (error: any) {
      return { success: false, message: 'Failed to upload songs', error: error.message };
    }
  }

  private mapSongs(songs: SongDocument[]) {
    return {
      success: true,
      data: {
        results: songs.map(song => ({
          id: song._id.toString(),
          name: song.title,
          primaryArtists: song.artists,
          image: [{ url: song.imageUrl, quality: '500x500' }],
          downloadUrl: [{ url: song.audioUrl, quality: '320kbps' }],
          duration: song.duration,
        })),
      }
    };
  }

  async getTrending() {
    const songs = await this.songModel.aggregate([{ $sample: { size: 50 } }]).exec();
    return this.mapSongs(songs);
  }

  async searchSongs(query: string) {
    const regex = new RegExp(query, 'i');
    const songs = await this.songModel.find({
      $or: [{ title: regex }, { artists: regex }]
    }).limit(30).exec();
    return this.mapSongs(songs);
  }

  async getSongById(id: string) {
    try {
      const song = await this.songModel.findById(id).exec();
      return song ? this.mapSongs([song]) : { success: false };
    } catch (error) {
      return { success: false };
    }
  }

  async getArtistSongs(name: string) {
    return this.searchSongs(name);
  }

  async deleteSong(id: string) {
    try {
      const deletedSong = await this.songModel.findByIdAndDelete(id).exec();
      if (!deletedSong) {
        return { success: false, message: 'Song not found' };
      }
      return { success: true, message: 'Song deleted successfully' };
    } catch (error: any) {
      return { success: false, message: 'Failed to delete song', error: error.message };
    }
  }
}
