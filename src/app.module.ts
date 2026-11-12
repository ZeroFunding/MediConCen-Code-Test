import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordEntity } from './record/record.entity';
import { RecordController } from './record/record.controller';
import { RecordService } from './record/record.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [RecordEntity],
      synchronize: true, // Dev ONLY
    }),
    TypeOrmModule.forFeature([RecordEntity]),
  ],
  controllers: [RecordController],
  providers: [RecordService],
})
export class AppModule {}