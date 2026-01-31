import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Import PrismaService
import { Couple } from '@prisma/client'; // Import Couple model type

@Injectable()
export class CouplesService {
  constructor(private prisma: PrismaService) {} // Inject PrismaService

  async createCouple(userOneId: string, userTwoId: string, coupleName: string): Promise<Couple> {
    return this.prisma.couple.create({
      data: {
        userOneId: userOneId,
        userTwoId: userTwoId,
        coupleName: coupleName,
      },
    });
  }

  async getCoupleByUserId(userId: string): Promise<Couple | null> {
    return this.prisma.couple.findFirst({
      where: {
        OR: [{ userOneId: userId }, { userTwoId: userId }],
      },
    });
  }

  async getCoupleById(coupleId: string): Promise<Couple | null> {
    return this.prisma.couple.findUnique({
      where: { id: coupleId },
    });
  }

  async updateCouple(coupleId: string, data: any): Promise<Couple> {
    return this.prisma.couple.update({
      where: { id: coupleId },
      data: {
        ...data,
        updatedAt: new Date(), // Prisma handles this automatically with @updatedAt, but good to be explicit if needed
      },
    });
  }
}
