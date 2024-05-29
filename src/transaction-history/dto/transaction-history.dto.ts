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
  'senderWallet',
  'receiver',
  'amount',
  'timeStamp',
  'note',
  'name',
]) {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  sourceId: number;

  @Expose()
  @ApiProperty()
  senderWallet: string;

  @ApiProperty()
  sourceName: string;

  @Expose()
  @ApiProperty()
  receiver: number;

  @Expose()
  @ApiProperty()
  amount: number;

  @Expose()
  @ApiProperty()
  note: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  timeStamp: Date;
}
