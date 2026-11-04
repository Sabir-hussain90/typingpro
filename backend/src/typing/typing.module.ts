import { Module } from '@nestjs/common';
import { TypingService } from './typing.service';
import { TypingController } from './typing.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TypingController],
  providers: [TypingService],
})
export class TypingModule {}