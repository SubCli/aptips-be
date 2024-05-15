import { DataSource } from 'typeorm';
import { TransactionHistory } from './transaction-history.entity';

export const transactionHistoryProviders = [
  {
    provide: 'TRANSACTION_HISTORY_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(TransactionHistory),
    inject: ['DATA_SOURCE'],
  },
];
