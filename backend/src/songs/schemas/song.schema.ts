import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SongDocument = Song & Document;

@Schema({ timestamps: true })
export class Song {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  artists: string;

  @Prop({ required: true })
  audioUrl: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ default: 300 })
  duration: number;
}

export const SongSchema = SchemaFactory.createForClass(Song);
