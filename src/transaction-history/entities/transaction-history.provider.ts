import { DataSource } from 'typeorm';
import { TransactionHistory } from './transaction-history.entity';
import { sourceProviders } from 'src/source/entities/source.provider';
export const transactionHistoryProviders = [
  {
    provide: 'TRANSACTION_HISTORY_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(TransactionHistory),
    inject: ['DATA_SOURCE'],
  },
  ...sourceProviders,
];
