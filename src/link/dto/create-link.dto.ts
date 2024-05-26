/**
 * Data transfer object for creating a link.
 */
import { PickType } from '@nestjs/swagger';
import { LinkDto } from '../dto/link.dto';
export class CreateLinkDto extends PickType(LinkDto, [
  'userId',
  'linkCode',
  'receivedAddress',
  'amount',
  'name',
  'config',
] as const) {}
