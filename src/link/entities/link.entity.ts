import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Source } from 'src/source/entities/source.entity';
@Entity()
export class Link {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('text', { name: 'link_code' })
  linkCode: string;

  @Column('text', { name: 'received_address' })
  receivedAddress: string;

  @Column('double')
  amount: number;

  @Column('text')
  name: string;

  @Column('int', { default: 0, name: 'total_number_donations' })
  totalNumberDonations: number;

  @Column('double', { default: 0, name: 'total_donations' })
  totalDonations: number;

  @OneToMany(() => Source, (source) => source.link)
  sources: Source[];

  @Column('text')
  config: string;

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
