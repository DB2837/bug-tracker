import { Project } from './../models/Project';
import { User } from '../models/User';
import { AppDataSource } from './../data-source';

class ProjectService {
  async getAllProjects() {
    try {
      const projects = await AppDataSource.getRepository(Project)
        .createQueryBuilder('project')
        .leftJoinAndSelect('project.members', 'members')
        .leftJoinAndSelect('project.createdBy', 'owner')
        .leftJoinAndSelect('project.bugs', 'bugs')
        .getMany();

      return projects;
    } catch (error) {
      console.error(error);
    }
  }

  async getProjectInfo(projectID: string) {
    try {
      const project = await AppDataSource.getRepository(Project)
        .createQueryBuilder('project')
        .where('project.id = :id', { id: projectID })
        .leftJoinAndSelect('project.members', 'members')
        .leftJoinAndSelect('project.createdBy', 'owner')
        .leftJoinAndSelect('project.bugs', 'bugs')
        .leftJoinAndSelect('project.createdBy', 'admin')
        .getOne();

      return project;
    } catch (error) {
      console.error(error);
    }
  }

  async getProjectByID(projectID: string) {
    try {
      const project = await AppDataSource.getRepository(Project)
        .createQueryBuilder('project')
        .where('project.id = :id', { id: projectID })
        .leftJoinAndSelect('project.members', 'members')
        .leftJoinAndSelect('project.bugs', 'bugs')
        .leftJoinAndSelect('project.createdBy', 'admin')
        .getOne();

      return project;
    } catch (error) {
      console.error(error);
    }
  }

  async addProject(
    title: string,
    owner: User,
    ownerId: string,
    members: User[]
  ) {
    try {
      const projectRepo = AppDataSource.getRepository(Project);
      const project = new Project();
      project.title = title;
      project.createdBy = owner;
      project.createdByUserId = ownerId;
      project.members = [owner, ...members];
      project.bugs = [];

      return projectRepo.save(project);
    } catch (error) {
      console.error(error);
    }
  }

  async getProjectBugs(projectID: string) {
    try {
      const projectbugs = await AppDataSource.getRepository(Project)
        .createQueryBuilder('project')
        .leftJoinAndSelect('project.bugs', 'bugs')
        /*  .leftJoinAndSelect('bug.createdBy', 'createdBy') */
        .where('project.id = :id', { id: projectID })
        .getMany();

      return projectbugs;
    } catch (error) {
      console.error(error);
    }
  }

  async getMembers(projectID: string) {
    try {
      const project = await AppDataSource.getRepository(Project)
        .createQueryBuilder('project')
        .where('project.id = :id', { id: projectID })
        .leftJoinAndSelect('project.members', 'members')

        .getOne();

      return project?.members;
    } catch (error) {
      console.error(error);
    }
  }

  async removeMember(projectID: string, memberID: string) {
    try {
      const projectRepo = AppDataSource.getRepository(Project);
      const project = await AppDataSource.getRepository(Project)
        .createQueryBuilder('project')
        .leftJoinAndSelect('project.members', 'members')
        .where('project.id = :id', { id: projectID })
        .getOne();

      if (project) {
        project.members = project.members.filter(
          (member: User) => member.id !== memberID
        );
        return projectRepo.save(project);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async updateMembers(projectID: string, membersArr: User[]) {
    try {
      const projectRepo = AppDataSource.getRepository(Project);

      const project = await AppDataSource.getRepository(Project)
        .createQueryBuilder('project')
        .leftJoinAndSelect('project.bugs', 'bugs')
        .leftJoinAndSelect('project.createdBy', 'createdBy')
        .where('project.id = :id', { id: projectID })
        .getOne();

      if (project) {
        project.members = membersArr;
        return projectRepo.save(project);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async editProjectTitle(projectID: string, newTitle: string) {
    try {
      await AppDataSource.createQueryBuilder()
        .update(Project)
        .set({ title: newTitle })
        .where('project.id = :id', { id: projectID })
        .execute();

      const project = await AppDataSource.getRepository(Project)
        .createQueryBuilder('project')
        .where('project.id = :id', { id: projectID })
        .leftJoinAndSelect('project.members', 'members')
        .leftJoinAndSelect('project.bugs', 'bugs')
        .leftJoinAndSelect('project.createdBy', 'admin')
        .getOne();

      return project;
    } catch (error) {
      console.error(error);
    }
  }

  async deleteProject(projectID: string) {
    try {
      await AppDataSource.getRepository(Project).delete(projectID);
    } catch (error) {
      console.error(error);
    }
  }
}

export default new ProjectService();
