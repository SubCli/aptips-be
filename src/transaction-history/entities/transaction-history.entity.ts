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

  @Column('text', { name: 'sender_wallet' })
  senderWallet: string;

  @Column('int', { name: 'receiver' })
  receiver: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'receiver' })
  receiveUser: User;

  @Column('double')
  amount: number;

  @Column('text', { name: 'name' })
  name: string;

  @Column('text')
  note: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  timeStamp: Date;
}
