import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Link } from 'src/link/entities/link.entity';
@Entity()
export class Source {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'link_id' })
  linkId: number;

  @ManyToOne(() => Link, (link) => link.id)
  @JoinColumn({ name: 'link_id' })
  link: Link;
  @Column('text', { name: 'utm_source' })
  utmSource: string;
}
