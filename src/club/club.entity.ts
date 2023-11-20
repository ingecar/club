import { SocioEntity } from 'src/socio/socio.entity';
import {
  Column,
  Entity,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ClubEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  fundationDate: Date;

  @Column()
  image: string;

  @Column()
  description: string;

  @ManyToMany(() => SocioEntity, (socio) => socio.club)
  @JoinTable()
  socio: SocioEntity[];
}
