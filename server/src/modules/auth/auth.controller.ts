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

  // ===== GOOGLE AUTH =====

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // Passport handles this
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any, @Res() res: Response) {
    const token = await this.authService.validateGoogleUser(req.user);

    res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?token=${token}`,
    );
  }

  // ===== REGISTER =====

  @Post('register')
  async register(
    @Body() body: { email: string; password: string; name: string },
  ) {
    return this.authService.register(
      body.email,
      body.password,
      body.name,
    );
  }

  // ===== LOGIN =====

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  // ===== CHANGE PASSWORD =====
  @Post('change-password')
  @UseGuards(AuthGuard('jwt'))
  async changePassword(
    @Req() req: any,
    @Body() body: { current: string; new: string; confirm: string },
  ) {
    // Note: The frontend should already validate new and confirm match
    return this.authService.changePassword(
      req.user.id,
      body.current,
      body.new,
    );
  }

  // ===== REFRESH TOKEN =====

  @Post('refresh')
  async refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }
}
