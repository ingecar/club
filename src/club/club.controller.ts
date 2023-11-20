import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { ClubService } from './club.service';
import { ClubEntity } from './club.entity';
import { plainToInstance } from 'class-transformer';
import { Post, Body } from '@nestjs/common';
import { ClubDto } from './club.dto';
import { Put } from '@nestjs/common';
import { Delete } from '@nestjs/common';
import { HttpCode } from '@nestjs/common';

@Controller('club')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  @Get()
  async findAll() {
    return await this.clubService.findAll();
  }

  @Get(':clubId')
  async findOne(@Param('clubId') clubId: string) {
    return await this.clubService.findOne(clubId);
  }

  @Post()
  async create(@Body() clubDto: ClubDto) {
    return await this.clubService.create(plainToInstance(ClubEntity, clubDto));
  }

  @Put(':clubId')
  async update(@Param('clubId') clubId: string, @Body() clubDto: ClubDto) {
    const club: ClubEntity = plainToInstance(ClubEntity, clubDto);
    return await this.clubService.update(clubId, club);
  }

  @Delete(':clubId')
  @HttpCode(204)
  async delete(@Param('clubId') clubId: string) {
    return await this.clubService.delete(clubId);
  }
}
