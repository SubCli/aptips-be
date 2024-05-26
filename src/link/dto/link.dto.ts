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
  'config',
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
  config: string;
}
