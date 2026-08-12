import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SongsModule } from './songs/songs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI as string, {
      serverSelectionTimeoutMS: 5000,
      family: 4,
    }),
    SongsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
