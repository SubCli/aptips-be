import { DataSource } from 'typeorm';
import { Link } from './link.entity';
import { UserProviders } from 'src/user/entities/user.provider';
export const linkProviders = [
  {
    provide: 'LINK_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Link),
    inject: ['DATA_SOURCE'],
  },
  ...UserProviders,
];
