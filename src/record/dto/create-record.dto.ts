import { IsNotEmpty, IsString, MaxLength, Matches } from 'class-validator';

export class CreateRecordDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255) // prevent OOM
  @Matches(/^[a-zA-Z0-9_-]+$/, { message: 'id1 can only contain alphanumeric characters, hyphens, and underscores' }) // prevent redis key injection
  id1: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @Matches(/^[a-zA-Z0-9_-]+$/, { message: 'id2 can only contain alphanumeric characters, hyphens, and underscores' })
  id2: string;
}