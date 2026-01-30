import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string, name: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      name,
      provider: 'local',
    });

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { access_token: token, user };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { access_token: token, user };
  }

  async validateGoogleUser(googleUser: any) {
    let user = await this.usersService.findByEmail(googleUser.email);

    if (!user) {
      user = await this.usersService.create({
        email: googleUser.email,
        name: googleUser.displayName,
        provider: 'google',
        googleId: googleUser.id,
      });
    }

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return token;
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken);
      const token = this.jwtService.sign({ sub: decoded.sub, email: decoded.email });
      return { access_token: token };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return null;
    }
  }
}
