import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { createClient, RedisClientType } from 'redis';
import { RecordEntity } from './record.entity';
import { CreateRecordDto } from './dto/create-record.dto';

@Injectable()
export class RecordService {
  private redisClient: RedisClientType;

  constructor(
    @InjectRepository(RecordEntity)
    private recordRepository: Repository<RecordEntity>,
  ) {
    this.redisClient = createClient({ url: process.env.REDIS_URL });
    this.redisClient.connect().catch(console.error);
  }

  async getOrCreateRecord(dto: CreateRecordDto): Promise<{ userID: string }> {
    const { id1, id2 } = dto;
    const cacheKey = `record:${id1}:${id2}`;

    // Check redis cache
    const cachedUserID = await this.redisClient.get(cacheKey);
    if (cachedUserID) {
      return { userID: cachedUserID };
    }

    // Cache miss then check MySQL
    let record = await this.recordRepository.findOne({ where: { id1, id2 } });
    
    if (record) {
      await this.redisClient.set(cacheKey, record.userID);
      return { userID: record.userID };
    }

    // Not even having record in MySQL -> create a new UUID
    const newUserID = uuidv4();
    const newRecord = this.recordRepository.create({ id1, id2, userID: newUserID });

    try {
      // Save the new UUID to MySQL
      await this.recordRepository.save(newRecord);
      await this.redisClient.set(cacheKey, newUserID);
      return { userID: newUserID };
    } catch (error: any) {
      // Concurrency Handling
      if (error.code === 'ER_DUP_ENTRY') {
        record = await this.recordRepository.findOne({ where: { id1, id2 } });
        if (record) {
          await this.redisClient.set(cacheKey, record.userID);
          return { userID: record.userID };
        }
      }
      // unexpected error catch (prevent error message leak information)
      throw new InternalServerErrorException('An unexpected error occurred while processing the record.');
    }
  }
}