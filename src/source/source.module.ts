import { Module } from '@nestjs/common';
import { SourceService } from './source.service';
import { SourceController } from './source.controller';
import { sourceProviders } from './entities/source.provider';
import { DatabaseModule } from '../database.module';
@Module({
  imports: [DatabaseModule],
  controllers: [SourceController],
  providers: [...sourceProviders, SourceService],
})
export class SourceModule {}
