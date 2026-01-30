import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getUser(id: string) {
    return this.usersService.findById(id);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAllUsers() {
    return this.usersService.findAll();
  }
}
