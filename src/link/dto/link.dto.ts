/**
 * Data transfer object for creating a link.
 */
import { ApiProperty } from '@nestjs/swagger';
import { PickType } from '@nestjs/mapped-types';
import { Link } from '../entities/link.entity';
import { Expose } from 'class-transformer';
export class LinkDto extends PickType(Link, [
  'id',
  'userId',
  'linkCode',
  'receivedAddress',
  'amount',
  'name',
  'totalNumberDonations',
  'totalDonations',
  'config',
  'createdAt',
]) {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  userId: number;

  @Expose()
  @ApiProperty()
  linkCode: string;

  @Expose()
  @ApiProperty()
  receivedAddress: string;

  @Expose()
  @ApiProperty()
  amount: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  totalNumberDonations: number;

  @Expose()
  @ApiProperty()
  totalDonations: number;

  @Expose()
  @ApiProperty()
  config: string;

  @Expose()
  @ApiProperty()
  createdAt: Date;
}
