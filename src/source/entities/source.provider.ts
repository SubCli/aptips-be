import { DataSource } from 'typeorm';
import { Source } from './source.entity';

export const sourceProviders = [
  {
    provide: 'SOURCE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Source),
    inject: ['DATA_SOURCE'],
  },
];
