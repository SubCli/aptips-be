import { DataSource } from 'typeorm';
import { User } from './user.entity';
import { Link } from 'src/link/entities/link.entity';

export const UserProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'LINK_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Link),
    inject: ['DATA_SOURCE'],
  },
];
