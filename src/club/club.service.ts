import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/business-errors';
import { ClubEntity } from './club.entity';

@Injectable()
export class ClubService {
  constructor(
    @InjectRepository(ClubEntity)
    private readonly clubRepository: Repository<ClubEntity>,
  ) {}

  async findAll(): Promise<ClubEntity[]> {
    return await this.clubRepository.find({ relations: ['socio'] });
  }

  async findOne(id: string): Promise<ClubEntity> {
    const club: ClubEntity = await this.clubRepository.findOne({
      where: { id },
      relations: ['socio'],
    });
    if (!club)
      throw new BusinessLogicException(
        'The club with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return club;
  }

  async create(club: ClubEntity): Promise<ClubEntity> {
    const { description } = club;
    if (description && description.length > 100) {
      throw new BusinessLogicException(
        'description is too long',
        BusinessError.BAD_REQUEST,
      );
    }
    return await this.clubRepository.save(club);
  }

  async update(id: string, club: ClubEntity): Promise<ClubEntity> {
    const clubToUpdate: ClubEntity = await this.clubRepository.findOne({
      where: { id },
    });
    if (!clubToUpdate)
      throw new BusinessLogicException(
        'The club with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    return await this.clubRepository.save({ ...clubToUpdate, ...club });
  }

  async delete(id: string): Promise<void> {
    const clubToDelete: ClubEntity = await this.clubRepository.findOne({
      where: { id },
    });
    if (!clubToDelete)
      throw new BusinessLogicException(
        'The club with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    await this.clubRepository.delete(clubToDelete.id);
  }
}
