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
        username: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || 'suIp@y2024',
        database: process.env.DATABASE_NAME || 'suidona',
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
