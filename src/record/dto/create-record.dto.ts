import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRecordDto {
  @IsNotEmpty({ message: 'id1 is required' })
  @IsString()
  id1: string;

  @IsNotEmpty({ message: 'id2 is required' })
  @IsString()
  id2: string;
}