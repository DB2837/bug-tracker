import { Comment } from './Comment';
import { User } from './User';
import { Project } from './Project';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

export enum Priority {
  low = 'low',
  medium = 'medium',
  high = 'high',
}

@Entity()
export class Bug {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'varchar', length: 550 })
  description: string;

  @Column({
    type: 'enum',
    enum: [Priority.low, Priority.medium, Priority.high],
    default: Priority.low,
  })
  priority: Priority;

  @Column({ default: false })
  isClosed: boolean;

  @ManyToOne(() => Project, (project) => project.bugs, { onDelete: 'CASCADE' })
  project: Project;

  @ManyToOne(() => User, (user) => user.bugsCreated)
  @JoinColumn({ name: 'createdByUserId' })
  createdBy: User;
  @Column()
  createdByUserId: string;

  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'closedByUserId' })
  closedBy: User;
  @Column({ type: 'text', nullable: true })
  closedByUserId: string | null;

  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'reOpenedByUserId' })
  reOpenedBy: User;
  @Column({ type: 'text', nullable: true })
  reOpenedByUserId: string | null;

  @OneToMany(() => Comment, (comment) => comment.bug, { nullable: true })
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  closedAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  reopenedAt: Date | null;
}
