import { SourceDto } from 'src/source/dto/source.dto';
import { ApiProperty } from '@nestjs/swagger';
import { RevenueByMonth } from './revenue-by-month.dto';
export class RevenueBySourceDto {
  @ApiProperty()
  source: SourceDto;
  @ApiProperty({ type: [RevenueByMonth] })
  totalRevenueByMonthList: RevenueByMonth[];
}
