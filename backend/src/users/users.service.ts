import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, isVerified: true, createdAt: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getTypingHistory(userId: string) {
    return this.prisma.typingResult.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
      include: { 
        paragraph: { select: { title: true } },
        user: { select: { email: true } }
      },
    });
  }
}