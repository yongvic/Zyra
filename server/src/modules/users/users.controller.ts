import { Controller, Get, UseGuards, Put, Body, Req, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard('jwt')) // Apply JWT guard to all user routes
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@Req() req: any) {
    return this.usersService.findById(req.user.id);
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Get()
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Put('me')
  async updateMe(
    @Req() req: any,
    @Body() body: { name?: string; email?: string },
  ) {
    return this.usersService.update(req.user.id, body);
  }
}
