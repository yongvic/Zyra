import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // Initiated by passport
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(req: any, res: Response) {
    const token = await this.authService.validateGoogleUser(req.user);
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }

  @Post('register')
  async register(body: { email: string; password: string; name: string }) {
    return this.authService.register(body.email, body.password, body.name);
  }

  @Post('login')
  async login(body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('refresh')
  async refreshToken(body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }
}
