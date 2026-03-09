import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SongsModule } from './songs/songs.module';
import { TagsModule } from './tags/tags.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { PrayersModule } from './prayers/prayers.module';
import { User } from './entities/user.entity';
import { Song } from './entities/song.entity';
import { Tag } from './entities/tag.entity';
import { Announcement } from './entities/announcement.entity';
import { Prayer } from './entities/prayer.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        url: configService.get<string>('DATABASE_URL'),
        entities: [User, Song, Tag, Announcement, Prayer],
        synchronize: true,
      }),
    }),
    AuthModule,
    UsersModule,
    SongsModule,
    TagsModule,
    AnnouncementsModule,
    PrayersModule,
  ],
})
export class AppModule {}
