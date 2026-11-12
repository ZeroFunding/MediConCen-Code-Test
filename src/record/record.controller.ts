import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { RecordService } from './record.service';
import { CreateRecordDto } from './dto/create-record.dto';

@Controller('api/records')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async createRecord(@Body() createRecordDto: CreateRecordDto) {
    // Call recordService
    // Return: JSON
    return this.recordService.getOrCreateRecord(createRecordDto);
  }
}