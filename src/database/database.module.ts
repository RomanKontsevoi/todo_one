import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { createPool } from 'mysql2/promise';

dotenv.config();

@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async () =>
        createPool({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
        }),
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}
