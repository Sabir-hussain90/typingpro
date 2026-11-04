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

  // 👇 Returns ALL history from ALL users
  @Get('history')
  getHistory() {
    return this.usersService.getAllRecentHistory();
  }
} 