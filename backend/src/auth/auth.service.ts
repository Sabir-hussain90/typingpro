import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    // 1. Admin Check
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      if (cleanEmail === process.env.ADMIN_EMAIL.trim() && cleanPassword === process.env.ADMIN_PASSWORD.trim()) {
        console.log("✅ ADMIN LOGIN SUCCESSFUL");
        
        // 👇 UPSERT: Update the email if it exists, create it if it doesn't
        const hashedPassword = await bcrypt.hash(cleanPassword, 10);
        const adminUser = await this.prisma.user.upsert({
          where: { email: cleanEmail },
          update: {
            isVerified: true,
            password: hashedPassword, 
          },
          create: {
            email: cleanEmail,
            password: hashedPassword,
            isVerified: true,
          }
        });

        console.log("✅ Admin saved in database with ID:", adminUser.id);

        const token = this.jwtService.sign({ sub: adminUser.id, email: cleanEmail, role: 'admin' });
        return { requiresActivation: false, access_token: token, user: { id: adminUser.id, email: cleanEmail, role: 'admin' } };
      }
    }

    // 2. Regular User Check
    const user = await this.prisma.user.findUnique({ where: { email: cleanEmail } });

    if (user && user.isVerified) {
      const isMatch = await bcrypt.compare(cleanPassword, user.password);
      if (!isMatch) throw new UnauthorizedException('Invalid credentials');
      
      const token = this.jwtService.sign({ sub: user.id, email: user.email, role: 'user' });
      return { requiresActivation: false, access_token: token, user: { id: user.id, email: user.email, role: 'user' } };
    } 
    
    // 3. New User -> OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(cleanPassword, 10);
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    if (user) {
      await this.prisma.user.update({
        where: { email: cleanEmail },
        data: { password: hashedPassword, otpCode: otp, otpExpiresAt },
      });
    } else {
      await this.prisma.user.create({
        data: { email: cleanEmail, password: hashedPassword, otpCode: otp, otpExpiresAt },
      });
    }

    await this.mailService.sendActivationEmail(cleanEmail, otp);
    return { requiresActivation: true, message: 'OTP sent to Gmail.' };
  }

  // ... (keep activate, forgotPassword, resetPassword as they are)
  async activate(email: string, otp: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new BadRequestException('User not found');
    if (user.otpCode !== otp) throw new BadRequestException('Invalid OTP');
    if (user.otpExpiresAt && user.otpExpiresAt < new Date()) throw new BadRequestException('OTP expired');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { email },
      data: { password: hashedPassword, isVerified: true, otpCode: null, otpExpiresAt: null },
    });
    return { message: 'Account activated successfully. You can now login.' };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new BadRequestException('User not found');
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await this.prisma.user.update({
      where: { email },
      data: { otpCode: otp, otpExpiresAt },
    });
    await this.mailService.sendPasswordResetEmail(email, otp);
    return { message: 'Reset OTP sent to email' };
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new BadRequestException('User not found');
    if (user.otpCode !== otp) throw new BadRequestException('Invalid OTP');
    if (user.otpExpiresAt && user.otpExpiresAt < new Date()) throw new BadRequestException('OTP expired');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { email },
      data: { password: hashedPassword, otpCode: null, otpExpiresAt: null },
    });
    return { message: 'Password reset successfully' };
  }
}