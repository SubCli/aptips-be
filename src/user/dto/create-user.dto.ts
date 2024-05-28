/**
 * Data transfer object for creating a user.
 */
import { PickType } from '@nestjs/swagger';
import { UserDto } from '../dto/user.dto';
export class CreateUserDto extends PickType(UserDto, [
  'walletAddress',
  'email',
  'avatarUrl',
  'fullName',
  'about',
] as const) {}
