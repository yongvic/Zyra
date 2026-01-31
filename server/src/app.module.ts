import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CouplesModule } from './modules/couples/couples.module';
import { ChatModule } from './modules/chat/chat.module'; // Uncommented
import { GamesModule } from './modules/games/games.module';
import { MemoriesModule } from './modules/memories/memories.module';
import { PrismaModule } from './prisma/prisma.module'; // Import PrismaModule

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_jwt_secret',
      signOptions: { expiresIn: process.env.JWT_EXPIRATION || '7d' },
    }),
    PassportModule,
    PrismaModule, // Use PrismaModule instead of DatabaseModule
    AuthModule,
    UsersModule,
    CouplesModule,
    ChatModule, // Uncommented
    GamesModule,
    MemoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
