/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { SocioClubService } from './socio-club.service';
import { SocioDto } from 'src/socio/socio.dto';
import { SocioEntity } from 'src/socio/socio.entity';
import { ClubEntity } from 'src/club/club.entity';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('clubes')
export class SocioClubController {
  constructor(private readonly socioClubService: SocioClubService) {}

  @Post(':clubId/socios/:socioId')
  async addMemberToClub(
    @Param('clubId') clubId: string,
    @Param('socioId') socioId: string,
  ) {
    return await this.socioClubService.addMemberToClub(clubId, socioId);
  }

  @Get(':clubId/socios')
  async listmembersfromclubId(@Param('clubId') clubId: string) {
    return await this.socioClubService.listmembersfromclubId(clubId);
  }

  @Get(':clubId/socios/:socioId')
  async findmembersfromclubbyId(
    @Param('clubId') clubId: string,
    @Param('socioId') socioId: string,
  ) {
    return await this.socioClubService.findmembersfromclubbyId(clubId, socioId);
  }

  @Delete(':clubId/socios/:socioId')
  @HttpCode(204)
  async deletememberfromclub(
    @Param('clubId') clubId: string,
    @Param('socioId') socioId: string,
  ) {
    return await this.socioClubService.deletememberfromclub(clubId, socioId);
  }
}
