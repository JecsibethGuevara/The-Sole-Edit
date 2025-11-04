import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import dbConfig from "./db/dbProd.config";
import { User } from "./modules/auth/entities/User.entity";
import { AuthModule } from "./modules/auth/auth.module";
import { JwtConfigService } from "./modules/auth/strategies/jwt.config";
import { StoresModule } from "./modules/stores/stores.module";
import { JwtAuthGuard } from "./common/guards/jwt.guard";
import { Store } from "./modules/stores/entities/store.entity";
import { Product } from "./modules/products/entities/product.entity";
import { ProductsModule } from "./modules/products/products.module";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        entities: [User, Store, Product],
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    StoresModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtAuthGuard],
})
export class AppModule { }


/* loads local environments, sets it to global */
