import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('records')
@Unique(['id1', 'id2']) //id1 & id2 must be unique
export class RecordEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  id1: string;

  @Column({ type: 'varchar', length: 255 })
  id2: string;

  @Column({ type: 'varchar', length: 36 })
  userID: string;
}