import { AppDataSource } from './../data-source';
import { User } from './../models/User';

class UserService {
  async getAllUsers(/* userID: string */) {
    try {
      const users = await AppDataSource.getRepository(User)
        .createQueryBuilder('user')
        /* .leftJoinAndSelect('user.projects', 'projects')
        .leftJoinAndSelect('user.ownedProjects', 'ownedProjects')
        .leftJoinAndSelect('user.bugsCreated', 'bugsCreated') */
        /*   .where('user.id != :id', { id: userID }) */

        .getMany();

      return users;
    } catch (error) {
      console.log(error);
    }
  }

  async getUserByID(userID: string) {
    try {
      const user = await AppDataSource.getRepository(User)
        .createQueryBuilder('user')
        .where('user.id = :id', { id: userID })
        .getOne();

      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async getUserByEmail(email: string) {
    try {
      const user = await AppDataSource.getRepository(User)
        .createQueryBuilder('user')
        .where('user.email = :email', { email: email })
        .getOne();

      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async getUsersByEmails(emailsArr: string[]) {
    try {
      const users: User[] = [];
      for (const email of emailsArr) {
        let user = await AppDataSource.getRepository(User)
          .createQueryBuilder('user')
          .where('user.email = :email', { email: email })
          .getOne();

        if (user) users.push(user);
      }

      return users;
    } catch (error) {
      console.log(error);
    }
  }

  async addUser(
    email: string,
    hashedPassowrd: string,
    firstName: string,
    lastName: string
  ) {
    try {
      const userRepo = AppDataSource.getRepository(User);
      const user = new User();
      user.email = email;
      user.password = hashedPassowrd;
      user.firstName = firstName;
      user.lastName = lastName;
      user.ownedProjects = [];
      user.projects = [];
      user.bugsCreated = [];

      return userRepo.save(user);
    } catch (error) {
      console.log(error);
    }
  }

  async getUserProjects(userID: string) {
    try {
      const UserProjects = await AppDataSource.getRepository(User)
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.projects', 'allProjects')
        .where('user.id = :id', { id: userID })
        .getOne();

      UserProjects?.projects;

      return UserProjects?.projects;
    } catch (error) {
      console.error(error);
    }
  }

  /*  async getUserProjects(userID: string) {
    try {
      const UserProjects = await AppDataSource.getRepository(User)
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.projects', 'allProjects')
        .leftJoinAndSelect('user.ownedProjects', 'ownedProjects')
        .where('user.id = :id', { id: userID })
        .getMany();

      return UserProjects;
    } catch (error) {
      console.error(error);
    }
  } */

  async getUserBugs(userID: string) {
    try {
      const Userbugs = await AppDataSource.getRepository(User)
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.bugsCreated', 'bugsCreated')
        .where('user.id = :id', { id: userID })
        .getMany();

      return Userbugs;
    } catch (error) {
      console.error(error);
    }
  }

  async getUserPassword(userID: string) {
    try {
      const user = await AppDataSource.getRepository(User)
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where('user.id = :id', { id: userID })
        .getOne();

      return user!.password;
    } catch (error) {
      console.error(error);
    }
  }

  async setRefreshToken(user: User, tokenJWT: string) {
    try {
      await AppDataSource.createQueryBuilder()
        .update(User)
        .set({ refreshToken: tokenJWT })
        .where('user.email = :email', { email: user.email })
        .execute();
    } catch (error) {
      console.error(error);
    }
  }

  async getUserByTokenJWT(token: string) {
    try {
      const user = await AppDataSource.getRepository(User)
        .createQueryBuilder('user')
        /* .addSelect('user.refreshToken') */
        .where('user.refreshToken = :refreshToken', { refreshToken: token })
        .getOne();

      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteTokenJWT(userID: string) {
    try {
      await AppDataSource.createQueryBuilder()
        .update(User)
        .set({ refreshToken: '' })
        .where('user.id = :id', { id: userID })
        .execute();
    } catch (error) {
      console.log(error);
    }
  }
}

export default new UserService();
