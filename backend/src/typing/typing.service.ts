import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TypingService {
  constructor(private prisma: PrismaService) {}

  async getAllParagraphs() {
    return this.prisma.paragraph.findMany({
      select: { id: true, title: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getParagraphById(id: string) {
    const para = await this.prisma.paragraph.findUnique({ where: { id } });
    if (!para) throw new NotFoundException('Paragraph not found');
    return para;
  }

  async addParagraph(title: string, content: string) {
    return this.prisma.paragraph.create({
      data: { title, content },
    });
  }

  async submitTest(userId: string, typedText: string, timeElapsedSeconds: number, paragraphId: string) {
    if (timeElapsedSeconds < 2) {
      throw new BadRequestException('Test too short to calculate.');
    }

    const para = await this.prisma.paragraph.findUnique({ where: { id: paragraphId } });
    if (!para) throw new NotFoundException('Paragraph not found');

    const timeInMinutes = Math.max(timeElapsedSeconds / 60, 0.01); 
    
    const typedWords = typedText.trim().split(/\s+/).filter(w => w !== "");
    const totalTypedWords = typedWords.length;

    if (totalTypedWords === 0) {
      throw new BadRequestException('No words typed.');
    }

    const targetWords = para.content.trim().split(/\s+/);
    let correctWords = 0;
    
    for (let i = 0; i < totalTypedWords; i++) {
      if (typedWords[i].toLowerCase() === targetWords[i]?.toLowerCase()) {
        correctWords++;
      }
    }

    const grossWpm = Math.round(totalTypedWords / timeInMinutes);
    const accuracy = Math.round((correctWords / totalTypedWords) * 100);
    const netWpm = Math.round(grossWpm * (accuracy / 100));
    const passed = accuracy >= 92;

    // 👇 Ensure we save under the Admin's REAL email
    let validUserId = userId;
    const userExists = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!userExists) {
      console.log(`⚠️ User ID ${userId} not found. Finding admin user...`);
      const adminUser = await this.prisma.user.findUnique({ 
        where: { email: process.env.ADMIN_EMAIL } 
      });
      if (adminUser) {
        validUserId = adminUser.id;
      } else {
        throw new BadRequestException('Admin user not found in database.');
      }
    }

    const result = await this.prisma.typingResult.create({
      data: {
        userId: validUserId,
        paragraphId,
        timeUsed: timeElapsedSeconds,
        wpm: grossWpm,
        accuracy,
        netWpm,
        errors: totalTypedWords - correctWords,
        passed,
      },
    });

    return {
      message: passed ? "Passed" : "Failed",
      result: {
        grossWpm,
        accuracy,
        netWpm,
        passed,
        savedId: result.id
      }
    };
  }
}