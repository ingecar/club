import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocioEntity } from './socio.entity';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/business-errors';

@Injectable()
export class SocioService {
  constructor(
    @InjectRepository(SocioEntity)
    private readonly socioRepository: Repository<SocioEntity>,
  ) {}

  async findAll(): Promise<SocioEntity[]> {
    return await this.socioRepository.find();
  }

  async findOne(id: string): Promise<SocioEntity> {
    const socio: SocioEntity = await this.socioRepository.findOne({
      where: { id },
      relations: ['club'],
    });
    if (!socio)
      throw new BusinessLogicException(
        'The socio with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    return socio;
  }

  async create(socio: SocioEntity): Promise<SocioEntity> {
    const { email } = socio;
    if (!email || !email.includes('@')) {
      throw new BusinessLogicException(
        'invalid email address',
        BusinessError.BAD_REQUEST,
      );
    }
    return await this.socioRepository.save(socio);
  }

  async update(id: string, socio: SocioEntity): Promise<SocioEntity> {
    const socioToUpdate: SocioEntity = await this.socioRepository.findOne({
      where: { id },
    });
    if (!socioToUpdate)
      throw new BusinessLogicException(
        'The socio with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    return await this.socioRepository.save({ ...socioToUpdate, ...socio });
  }

  async delete(id: string): Promise<void> {
    const socioToDelete: SocioEntity = await this.socioRepository.findOne({
      where: { id },
    });
    if (!socioToDelete)
      throw new BusinessLogicException(
        'The socio with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    await this.socioRepository.delete(id);
  }
}
