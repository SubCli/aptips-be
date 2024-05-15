import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
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

  @Column({ length: 64, name: 'received_address' })
  receivedAddress: string;

  @Column('double')
  amount: number;

  @Column('text')
  name: string;
}
