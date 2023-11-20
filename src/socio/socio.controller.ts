import { Controller, Delete, Post, Put } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { SocioService } from './socio.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { Get } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { SocioEntity } from './socio.entity';
import { plainToInstance } from 'class-transformer';
import { Body } from '@nestjs/common';
import { SocioDto } from './socio.dto';
import { HttpCode } from '@nestjs/common';

@Controller('socio')
@UseInterceptors(BusinessErrorsInterceptor)
export class SocioController {
  constructor(private readonly socioService: SocioService) {}

  @Get()
  async findAll() {
    return await this.socioService.findAll();
  }

  @Get(':socioId')
  async findOne(@Param('socioId') socioId: string) {
    return await this.socioService.findOne(socioId);
  }

  @Post()
  async create(@Body() socioDto: SocioDto) {
    return await this.socioService.create(
      plainToInstance(SocioEntity, socioDto),
    );
  }

  @Put(':socioId')
  async update(@Param('socioId') socioId: string, @Body() socioDto: SocioDto) {
    const socio: SocioEntity = plainToInstance(SocioEntity, socioDto);
    return await this.socioService.update(socioId, socio);
  }

  @Delete(':socioId')
  @HttpCode(204)
  async delete(@Param('socioId') socioId: string) {
    return await this.socioService.delete(socioId);
  }
}
