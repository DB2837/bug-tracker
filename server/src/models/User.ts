import { Bug } from './Bug';
import { Project } from './Project';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: null, select: false })
  refreshToken: string;

  @ManyToMany(() => Project, (project) => project.members, { nullable: true })
  @JoinTable({ name: 'users_projects' })
  projects: Project[];

  @OneToMany(() => Project, (project) => project.createdBy, { nullable: true })
  ownedProjects: Project[];

  @OneToMany(() => Bug, (bug) => bug.createdBy, { nullable: true })
  bugsCreated: Bug[];
}
