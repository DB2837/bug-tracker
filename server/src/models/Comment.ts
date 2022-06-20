import { Bug } from './Bug';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'createdByUserdId' })
  creator: User;
  @Column()
  createdByUserdId: string;

  @ManyToOne(() => Bug, (bug) => bug.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bugId' })
  bug: Bug;
  @Column()
  bugId: string;
}
