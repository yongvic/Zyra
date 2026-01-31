import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
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
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

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

    if (!user.password) {
      // Social login accounts won't have a password hash
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    // Never return password hash to the client
    const { password: _password, ...safeUser } = user;
    return { access_token: token, user: safeUser };
  }

  async changePassword(userId: string, currentPassword?: string, newPassword?: string) {
    const user = await this.usersService.findByIdWithPassword(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // If changing password from a local account, currentPassword is required
    if (user.provider === 'local') {
      if (!currentPassword) {
        throw new BadRequestException('Current password is required to change password.');
      }
      if (!user.password) {
        throw new UnauthorizedException('User has no password set (e.g., social login)');
      }
      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        throw new UnauthorizedException('Invalid current password');
      }
    } else {
        // For social logins, we might allow setting a password without currentPassword
        // or prevent password change altogether. For now, allow setting if not local.
        if (currentPassword) { // If current password is provided for social login, it's an error.
          throw new BadRequestException('Cannot change password for social login account with current password.');
        }
    }

    if (!newPassword) {
      throw new BadRequestException('New password is required.');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.update(userId, { password: hashedNewPassword });
    return { message: 'Password updated successfully' };
  }

  async validateGoogleUser(googleUser: any) {
    const existing = await this.usersService.findByEmail(googleUser.email);

    const userId = existing
      ? existing.id
      : (await this.usersService.create({
          email: googleUser.email,
          name: googleUser.displayName,
          provider: 'google',
          googleId: googleUser.id,
        })).id;

    const token = this.jwtService.sign({ sub: userId, email: googleUser.email });
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
