/**
 * Data transfer object for creating a source.
 */
import { ApiProperty } from '@nestjs/swagger';
import { PickType } from '@nestjs/mapped-types';
import { Source } from '../entities/source.entity';
import { Expose } from 'class-transformer';
export class SourceDto extends PickType(Source, ['id', 'linkId', 'utmSource']) {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  linkId: number;

  @Expose()
  @ApiProperty()
  utmSource: string;
}
