import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VerifiedGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) throw new UnauthorizedException('Not authenticated');
    
    // Admin is always verified
    if (user.role === 'admin') return true;

    const dbUser = await this.prisma.user.findUnique({ where: { id: user.userId } });
    if (!dbUser || !dbUser.isVerified) {
      throw new UnauthorizedException('Account not verified. Please activate via Gmail.');
    }

    return true;
  }
}