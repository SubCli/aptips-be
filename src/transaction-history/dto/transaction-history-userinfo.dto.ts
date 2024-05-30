import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/user/dto/user.dto';
export class TransactionHistoryUserInfoDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  sourceId: number;
  @ApiProperty()
  sourceName: string;
  @ApiProperty()
  senderInfo: UserDto;
  @ApiProperty()
  receiverInfo: UserDto;
  @ApiProperty()
  amount: number;
  @ApiProperty()
  timeStamp: Date;
  @ApiProperty()
  note: string;
  @ApiProperty()
  name: string;
}
