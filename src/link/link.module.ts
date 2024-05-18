import { Module } from '@nestjs/common';
import { LinkService } from './link.service';
import { LinkController } from './link.controller';
import { linkProviders } from './entities/link.provider';
import { DatabaseModule } from '../database.module';
import { sourceProviders } from 'src/source/entities/source.provider';
@Module({
  imports: [DatabaseModule],
  controllers: [LinkController],
  providers: [...linkProviders, ...sourceProviders, LinkService],
})
export class LinkModule {}
