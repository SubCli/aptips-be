import { join } from 'path';
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
        username: process.env.USER || 'tung',
        password: process.env.PASSWORD || '12345678',
        database: process.env.DATABASE_NAME || 'suidb',
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
