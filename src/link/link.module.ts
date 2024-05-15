import { Module } from '@nestjs/common';
import { LinkService } from './link.service';
import { LinkController } from './link.controller';
import { linkProviders } from './entities/link.provider';
import { DatabaseModule } from '../database.module';
@Module({
  imports: [DatabaseModule],
  controllers: [LinkController],
  providers: [...linkProviders, LinkService],
})
export class LinkModule {}
