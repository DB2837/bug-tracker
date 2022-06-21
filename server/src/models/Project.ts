import { Bug } from './Bug';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @ManyToMany(() => User, (user) => user.projects, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  members: User[];

  @ManyToOne(() => User, (user) => user.ownedProjects)
  @JoinColumn({ name: 'createdByUserId' })
  createdBy: User;
  @Column()
  createdByUserId: string;

  @OneToMany(() => Bug, (bug) => bug.project, { nullable: true })
  bugs: Bug[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
