import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CouplesService } from './couples.service';

@Controller('couples')
@UseGuards(AuthGuard('jwt'))
export class CouplesController {
  constructor(private readonly couplesService: CouplesService) {}

  @Post()
  async createCouple(@Req() req: any, @Body() body: { userId2: string; coupleName: string }) {
    return this.couplesService.createCouple(req.user.id, body.userId2, body.coupleName);
  }

  @Post('invite')
  async inviteByEmail(
    @Req() req: any,
    @Body() body: { partnerEmail: string; coupleName?: string },
  ) {
    return this.couplesService.inviteByEmail(
      req.user.id,
      body.partnerEmail,
      body.coupleName ?? 'Notre couple',
    );
  }

  @Get(':id')
  async getCouple(@Param('id') id: string) {
    return this.couplesService.getCoupleById(id);
  }

  @Get()
  async getCoupleByUser(@Req() req: any) {
    return this.couplesService.getCoupleByUserId(req.user.id);
  }
}
