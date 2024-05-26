import { ApiProperty } from '@nestjs/swagger';
/**
 * Represents the revenue by month.
 */
export class RevenueByMonth {
  @ApiProperty()
  year: number;
  @ApiProperty()
  month: number;
  @ApiProperty()
  revenue: number;
}
