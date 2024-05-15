import { Module } from '@nestjs/common';
import { TransactionHistoryService } from './transaction-history.service';
import { TransactionHistoryController } from './transaction-history.controller';
import { DatabaseModule } from 'src/database.module';
import { transactionHistoryProviders } from './entities/transaction-history.provider';
@Module({
  imports: [DatabaseModule],
  controllers: [TransactionHistoryController],
  providers: [...transactionHistoryProviders, TransactionHistoryService],
})
export class TransactionHistoryModule {}
