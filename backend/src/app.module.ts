import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SongsModule } from './songs/songs.module';
import { TagsModule } from './tags/tags.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { PrayersModule } from './prayers/prayers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    SongsModule,
    TagsModule,
    AnnouncementsModule,
    PrayersModule,
  ],
})
export class AppModule {}
