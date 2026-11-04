import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: any) {
    return this.usersService.getProfile(req.user.userId);
  }

  // 👇 This tries to get the user's history by their ID
  @Get('history')
  @UseGuards(JwtAuthGuard)
  getHistory(@Req() req: any) {
    return this.usersService.getTypingHistory(req.user.userId);
  }
}