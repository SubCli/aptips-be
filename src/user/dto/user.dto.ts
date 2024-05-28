/**
 * Data transfer object for creating a link.
 */
import { ApiProperty } from '@nestjs/swagger';
import { PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';
import { Expose } from 'class-transformer';
export class UserDto extends PickType(User, [
  'id',
  'walletAddress',
  'email',
  'avatarUrl',
  'fullName',
  'about',
]) {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  walletAddress: string;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  avatarUrl: string;

  @Expose()
  @ApiProperty()
  totalDonations: number;

  @Expose()
  @ApiProperty()
  fullName: string;

  @Expose()
  @ApiProperty()
  about: string;
}
