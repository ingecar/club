import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClubEntity } from './club.entity';
import { ClubService } from './club.service';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/testing-config';
import { faker } from '@faker-js/faker';

describe('ClubService', () => {
  let service: ClubService;
  let repository: Repository<ClubEntity>;
  let clubList: ClubEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubService],
    }).compile();

    service = module.get<ClubService>(ClubService);
    repository = module.get<Repository<ClubEntity>>(
      getRepositoryToken(ClubEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    clubList = [];
    for (let i = 0; i < 5; i++) {
      const club: ClubEntity = await repository.save({
        name: faker.company.name(),
        fundationDate: faker.date.birthdate(),
        image: faker.image.imageUrl(),
        description: faker.lorem.sentence(),
      });
      clubList.push(club);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all clubs', async () => {
    const clubs: ClubEntity[] = await service.findAll();
    expect(clubs).not.toBeNull();
    expect(clubs).toHaveLength(clubList.length);
  });

  it('findOne should return a club by id', async () => {
    const storedclub: ClubEntity = clubList[0];
    const club: ClubEntity = await service.findOne(storedclub.id);
    expect(club).not.toBeNull();
    expect(club.name).toEqual(storedclub.name);
    expect(club.fundationDate).toEqual(storedclub.fundationDate);
    expect(club.image).toEqual(storedclub.image);
    expect(club.description).toEqual(storedclub.description);
  });

  it('findOne should throw an exception for an invalid club', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The club with the given id was not found',
    );
  });

  it('create should return a new club', async () => {
    const club: ClubEntity = {
      id: '',
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      fundationDate: faker.date.birthdate(),
      image: faker.image.imageUrl(),
      socio: [],
    };

    const newclub: ClubEntity = await service.create(club);
    expect(newclub).not.toBeNull();

    const storedclub: ClubEntity = await repository.findOne({
      where: { id: newclub.id },
    });
    expect(storedclub).not.toBeNull();
    expect(storedclub.fundationDate).toEqual(newclub.fundationDate);

    expect(storedclub.description).toEqual(newclub.description);
  });

  it('update should modify a club', async () => {
    const club: ClubEntity = clubList[0];
    club.name = 'New name';
    club.description = 'New description';

    const updatedclub: ClubEntity = await service.update(club.id, club);
    expect(updatedclub).not.toBeNull();

    const storedclub: ClubEntity = await repository.findOne({
      where: { id: club.id },
    });
    expect(storedclub).not.toBeNull();
    expect(storedclub.name).toEqual(club.name);
    expect(storedclub.description).toEqual(club.description);
  });

  it('update should throw an exception for an invalid club', async () => {
    let club: ClubEntity = clubList[0];
    club = {
      ...club,
      name: 'New name',
      description: 'New description',
    };
    await expect(() => service.update('0', club)).rejects.toHaveProperty(
      'message',
      'The club with the given id was not found',
    );
  });
  0;
  it('delete should remove a club', async () => {
    const club: ClubEntity = clubList[0];
    await service.delete(club.id);

    const deletedclub: ClubEntity = await repository.findOne({
      where: { id: club.id },
    });
    expect(deletedclub).toBeNull();
  });

  it('delete should throw an exception for an invalid club', async () => {
    const club: ClubEntity = clubList[0];
    await service.delete(club.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The club with the given id was not found',
    );
  });
});
