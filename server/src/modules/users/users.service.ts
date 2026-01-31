import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Import PrismaService
import { User } from '@prisma/client'; // Import User model type

type SafeUser = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {} // Inject PrismaService

  private toSafeUser(user: User): SafeUser {
    // Never leak password hashes to controllers/clients
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safe } = user;
    return safe;
  }

  async create(userData: {
    email: string;
    password?: string;
    name: string;
    provider: string;
    googleId?: string;
  }): Promise<SafeUser> {
    const user = await this.prisma.user.create({
      data: {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        provider: userData.provider,
        googleId: userData.googleId,
      },
    });
    return this.toSafeUser(user);
  }

  async findById(id: string): Promise<SafeUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user ? this.toSafeUser(user) : null;
  }

  async findByIdWithPassword(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, userData: any): Promise<SafeUser> {
    const user = await this.prisma.user.update({
      where: { id },
      data: userData,
    });
    return this.toSafeUser(user);
  }

  async findAll(): Promise<SafeUser[]> {
    const users = await this.prisma.user.findMany();
    return users.map((u) => this.toSafeUser(u));
  }
}
