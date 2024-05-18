import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Source } from 'src/source/entities/source.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class TransactionHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'source_id' })
  sourceId: number;

  @ManyToOne(() => Source, (source) => source.id)
  @JoinColumn({ name: 'source_id' })
  source: Source;

  @Column('int', { name: 'sender' })
  sender: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'sender' })
  sendUser: User;

  @Column('text', { name: 'receiver' })
  receiver: string;

  @Column('double')
  amount: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  timeStamp: Date;
}
