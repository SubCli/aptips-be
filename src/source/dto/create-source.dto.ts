import { PickType } from '@nestjs/swagger';
import { SourceDto } from './source.dto';
export class CreateSourceDto extends PickType(SourceDto, [
  'linkId',
  'utmSource',
] as const) {}
