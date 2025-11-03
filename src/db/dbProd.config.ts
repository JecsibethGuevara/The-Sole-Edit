import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
    'database',
    (): TypeOrmModuleOptions => ({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: process.env.NODE_ENV !== 'production',
        logging: process.env.NODE_ENV !== 'production',
        migrations: [__dirname + '/../migrations/*{.ts,.js}'],
        migrationsRun: process.env.NODE_ENV === 'production',
    })
)