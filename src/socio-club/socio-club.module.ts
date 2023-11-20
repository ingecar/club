import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocioEntity } from 'src/socio/socio.entity';
import { ClubEntity } from 'src/club/club.entity';
import { SocioClubService } from './socio-club.service';
import { SocioService } from 'src/socio/socio.service';
import { ClubService } from 'src/club/club.service';

@Module({
  imports: [TypeOrmModule.forFeature([SocioEntity, ClubEntity])],
  providers: [SocioClubService, SocioService, ClubService],
})
export class SocioClubModule {}
