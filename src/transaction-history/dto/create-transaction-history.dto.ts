import { PickType } from '@nestjs/swagger';
import { TransactionHistoryDto } from './transaction-history.dto';
export class CreateTransactionHistoryDto extends PickType(
  TransactionHistoryDto,
  ['sourceId', 'sender', 'receiver', 'amount'] as const,
) {}
