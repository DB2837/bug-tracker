import { AppDataSource } from './../data-source';
import { User } from './../models/User';
import { Bug } from './../models/Bug';
import { Comment } from './../models/Comment';

class CommentService {
  async addComment(
    description: string,
    creator: User,
    creatorID: string,
    bug: Bug,
    bugID: string
  ) {
    try {
      const commentRepo = AppDataSource.getRepository(Comment);
      const comment = new Comment();
      comment.description = description;
      comment.creator = creator;
      comment.createdByUserdId = creatorID;
      comment.bug = bug;
      comment.bugId = bugID;

      return commentRepo.save(comment);
    } catch (error) {
      console.error(error);
    }
  }

  async getBugComments(bug: Bug) {
    try {
      const comments = [];
      for (const comment of bug.comments) {
        const c = await AppDataSource.getRepository(Comment)
          .createQueryBuilder('comment')
          .leftJoinAndSelect('comment.creator', 'creator')
          .where('comment.id = :id', { id: comment.id })
          .getOne();
        comments.push(c);
      }

      return comments;
    } catch (error) {
      console.error(error);
    }
  }

  async getCommentByID(commentID: string) {
    try {
      const comment = await AppDataSource.getRepository(Comment)
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.creator', 'creator')
        .where('comment.id = :id', { id: commentID })
        .getOne();

      return comment;
    } catch (error) {
      console.error(error);
    }
  }

  async editComment(commentID: string, newDescription: string) {
    try {
      await AppDataSource.createQueryBuilder()
        .update(Comment)
        .set({ description: newDescription })
        .where('comment.id = :id', { id: commentID })
        .execute();

      const updatedComment = this.getCommentByID(commentID);

      return updatedComment;
    } catch (error) {
      console.error(error);
    }
  }

  async removeComment(commentID: string) {
    try {
      await AppDataSource.getRepository(Comment).delete(commentID);
    } catch (error) {
      console.error(error);
    }
  }
}

export default new CommentService();
