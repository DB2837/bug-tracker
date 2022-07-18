import { Project } from './../models/Project';
import { User } from './../models/User';
import { Bug, Priority } from './../models/Bug';
import { AppDataSource } from './../data-source';

class BugService {
  /*  async getUserBugs(userID: string) {
    try {
      const bugs = await AppDataSource.getRepository(User)
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.bugsCreated', 'bugsCreated')
        .leftJoinAndSelect('bug.comments', 'comments')
        .leftJoinAndSelect('bug.createdByUserId', 'CreatedByUserID')
        .leftJoinAndSelect('bug.closedByUserId', 'ClosedByUserID')
        .where('user.id = :id', { id: userID })
        .getMany();

      return bugs;
    } catch (error) {
      console.error(error);
    }
  } */

  async addBug(
    title: string,
    description: string,
    creator: User,
    creatorID: string,
    project: Project,
    priority?: string
  ) {
    try {
      const bugRepo = AppDataSource.getRepository(Bug);
      const bug = new Bug();
      bug.title = title;
      bug.description = description;
      bug.createdBy = creator;
      bug.createdByUserId = creatorID;
      bug.project = project;
      bug.priority = priority ? (priority as Priority) : ('low' as Priority);
      bug.isClosed = false;
      bug.comments = [];

      return bugRepo.save(bug);
    } catch (error) {
      console.error(error);
    }
  }

  async getBugByID(bugID: string) {
    try {
      const bug = await AppDataSource.getRepository(Bug)
        .createQueryBuilder('bug')
        .where('bug.id = :id', { id: bugID })
        .leftJoinAndSelect('bug.comments', 'comments')
        .leftJoinAndSelect('bug.createdBy', 'createdBy')
        .leftJoinAndSelect('bug.closedBy', 'closedBy')
        .leftJoinAndSelect('bug.reOpenedBy', 'reOpenedBy')
        /*  .leftJoinAndSelect('comment.creator', 'creator') */

        .getOne();

      return bug;
    } catch (error) {
      console.error(error);
    }
  }

  async removeBug(bugID: string) {
    try {
      await AppDataSource.getRepository(Bug).delete(bugID);
    } catch (error) {
      console.error(error);
    }
  }

  async updateBug(
    bugID: string,
    title: string,
    description: string,
    priority: Priority
  ) {
    try {
      await AppDataSource.createQueryBuilder()
        .update(Bug)
        .set({ title: title, description: description, priority: priority })
        .where('id = :id', { id: bugID })
        .execute();

      const updatedBug = this.getBugByID(bugID);

      return updatedBug;
    } catch (error) {
      console.error(error);
    }
  }

  async closeBug(bugID: string, member: User) {
    try {
      await AppDataSource.createQueryBuilder()
        .update(Bug)
        .set({ isClosed: true, closedBy: member })
        .where('bug.id = :id', { id: bugID })
        .execute();

      const bug = await AppDataSource.getRepository(Bug)
        .createQueryBuilder('bug')
        .where('bug.id = :id', { id: bugID })
        .leftJoinAndSelect('bug.comments', 'comments')
        .leftJoinAndSelect('bug.createdBy', 'createdBy')
        .leftJoinAndSelect('bug.closedBy', 'closedBy')
        .leftJoinAndSelect('bug.reOpenedBy', 'reOpenedBy')
        /*  .leftJoinAndSelect('comment.creator', 'creator') */

        .getOne();

      return bug;
    } catch (error) {
      console.error(error);
    }
  }

  async openBug(bugID: string, member: User) {
    try {
      await AppDataSource.createQueryBuilder()
        .update(Bug)
        .set({ isClosed: false, reOpenedBy: member })
        .where('bug.id = :id', { id: bugID })
        .execute();

      const bug = await AppDataSource.getRepository(Bug)
        .createQueryBuilder('bug')
        .where('bug.id = :id', { id: bugID })
        .leftJoinAndSelect('bug.comments', 'comments')
        .leftJoinAndSelect('bug.createdBy', 'createdBy')
        .leftJoinAndSelect('bug.closedBy', 'closedBy')
        .leftJoinAndSelect('bug.reOpenedBy', 'reOpenedBy')
        /*  .leftJoinAndSelect('comment.creator', 'creator') */

        .getOne();

      return bug;
    } catch (error) {
      console.error(error);
    }
  }

  /* async editProjectTitle(projectID: string, newTitle: string) {
    try {
      const modifedProject = await AppDataSource.createQueryBuilder()
        .update(Project)
        .set({ title: newTitle })
        .where('project.id = :id', { id: projectID })
        .execute();

      return modifedProject;
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
  } */
}

export default new BugService();
