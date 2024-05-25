import { ApiProperty } from '@nestjs/swagger';
export class RevenueByMonth {
  @ApiProperty()
  year: number;
  @ApiProperty()
  month: number;
  @ApiProperty()
  revenue: number;
}
