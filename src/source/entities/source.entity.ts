import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Link } from 'src/link/entities/link.entity';
import { TransactionHistory } from 'src/transaction-history/entities/transaction-history.entity';
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
  @Column('int', { default: 0, name: 'total_number_donations' })
  totalNumberDonations: number;
  @Column('double', { default: 0, name: 'total_donations' })
  totalDonations: number;
  @OneToMany(
    () => TransactionHistory,
    (transactionHistory) => transactionHistory.source,
  )
  transactionHistories: TransactionHistory[];
}
