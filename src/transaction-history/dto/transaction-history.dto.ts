/**
 * Data transfer object for creating a link.
 */
import { ApiProperty } from '@nestjs/swagger';
import { PickType } from '@nestjs/mapped-types';
import { TransactionHistory } from '../entities/transaction-history.entity';
import { Expose } from 'class-transformer';
export class TransactionHistoryDto extends PickType(TransactionHistory, [
  'id',
  'sourceId',
  'sender',
  'receiver',
  'amount',
  'timeStamp',
]) {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  sourceId: number;

  @Expose()
  @ApiProperty()
  sender: number;

  @Expose()
  @ApiProperty()
  receiver: string;

  @Expose()
  @ApiProperty()
  amount: number;

  @Expose()
  @ApiProperty()
  timeStamp: Date;
}
