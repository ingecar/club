import { Injectable } from '@nestjs/common';
import { ClubEntity } from 'src/club/club.entity';
import { SocioEntity } from 'src/socio/socio.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/business-errors';

@Injectable()
export class SocioClubService {
  constructor(
    @InjectRepository(ClubEntity)
    private readonly clubRepository: Repository<ClubEntity>,

    @InjectRepository(SocioEntity)
    private readonly socioRepository: Repository<SocioEntity>,
  ) {}

  async addMemberToClub(clubId: string, socioId: string): Promise<ClubEntity> {
    const socio: SocioEntity = await this.socioRepository.findOne({
      where: { id: socioId },
    });
    if (!socio)
      throw new BusinessLogicException(
        'The socio with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    const club: ClubEntity = await this.clubRepository.findOne({
      where: { id: clubId },
      relations: ['socio'],
    });
    if (!club)
      throw new BusinessLogicException(
        'The club with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    club.socio = [...club.socio, socio];
    return await this.clubRepository.save(club);
  }

  async listmembersfromclubId(clubId: string): Promise<SocioEntity[]> {
    const club: ClubEntity = await this.clubRepository.findOne({
      where: { id: clubId },
      relations: ['socio'],
    });
    if (!club)
      throw new BusinessLogicException(
        'The club with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return club.socio;
  }

  async findmembersfromclubbyId(clubId: string, socioId: string) {
    const club: ClubEntity = await this.clubRepository.findOne({
      where: { id: clubId },
      relations: ['socio'],
    });
    if (!club)
      throw new BusinessLogicException(
        'The club with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    const socio: SocioEntity = await this.socioRepository.findOne({
      where: { id: socioId },
    });
    if (!socio)
      throw new BusinessLogicException(
        'The socio with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    return club.socio.find((socio) => socio.id === socioId);
  }

  async deletememberfromclub(
    clubId: string,
    socioId: string,
  ): Promise<ClubEntity> {
    const socio: SocioEntity = await this.socioRepository.findOne({
      where: { id: socioId },
    });
    if (!socio)
      throw new BusinessLogicException(
        'The socio with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    const club: ClubEntity = await this.clubRepository.findOne({
      where: { id: clubId },
      relations: ['socio'],
    });
    if (!club)
      throw new BusinessLogicException(
        'The club with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const socioToDelete = club.socio.find((socio) => socio.id === socioId);
    if (!socioToDelete)
      throw new BusinessLogicException(
        'The socio with the given id is not associated to the club',
        BusinessError.PRECONDITION_FAILED,
      );

    club.socio = club.socio.filter((socio) => socio.id !== socioId);
    return await this.clubRepository.save(club);
  }

  // async deleteallmembersfromclub(clubId: string): Promise<ClubEntity> {
  //   const club: ClubEntity = await this.socioRepository.findOne({
  //     where: { id: clubId },
  //   });
  //   if (!club)
  //     throw new BusinessLogicException(
  //       'The club with the given id was not found',
  //       BusinessError.NOT_FOUND,
  //     );
  //   club.socio = [];
  //   return await this.socioRepository.save(club);
  // }
}
