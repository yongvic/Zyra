import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Couple } from '@prisma/client';
import { UsersService } from '../users/users.service';

@Injectable()
export class CouplesService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async inviteByEmail(
    userOneId: string,
    partnerEmail: string,
    coupleName?: string,
  ): Promise<Couple> {
    if (!partnerEmail?.trim()) {
      throw new BadRequestException('Email du partenaire requis');
    }
    if (userOneId === undefined) {
      throw new BadRequestException('Utilisateur non authentifié');
    }

    const partner = await this.usersService.findByEmail(partnerEmail.trim().toLowerCase());
    if (!partner) {
      throw new NotFoundException(
        'Partenaire non trouvé. Demandez-lui de créer un compte Zyra d\'abord.',
      );
    }

    if (partner.id === userOneId) {
      throw new BadRequestException('Vous ne pouvez pas vous inviter vous-même');
    }

    const existingCoupleForUser = await this.getCoupleByUserId(userOneId);
    if (existingCoupleForUser) {
      throw new ConflictException('Vous avez déjà un couple. Un compte ne peut avoir qu\'un seul couple.');
    }

    const existingCoupleForPartner = await this.getCoupleByUserId(partner.id);
    if (existingCoupleForPartner) {
      throw new ConflictException('Votre partenaire fait déjà partie d\'un couple.');
    }

    return this.createCouple(userOneId, partner.id, coupleName || 'Notre couple');
  }

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
