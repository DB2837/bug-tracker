import { Request, Response } from 'express';
import userService from '../services/userService';
import projectService from '../services/projectService';
import bugService from '../services/bugService';
import commentService from '../services/commentService';

export const postComment = async (req: Request, res: Response) => {
  try {
    const creatorID = req.user.id;
    const bugID = req.params.bugID;
    const projectID = req.params.projectID;
    const { description } = req.body;

    const bug = await bugService.getBugByID(bugID);
    const creator = await userService.getUserByID(creatorID);
    const projectMembers = await projectService.getMembers(projectID);

    if (!creator || !bug || !description || !projectMembers) {
      return res.status(400).send('invalid inputs');
    }

    if (!projectMembers.find((user) => user.id === creatorID)) {
      return res
        .status(401)
        .send({ message: 'Access is denied. Not a member of the project.' });
    }

    const comment = await commentService.addComment(
      description,
      creator,
      creatorID,
      bug,
      bugID
    );

    return res.status(201).send(comment);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const bugID = req.params.bugID;
    const projectID = req.params.projectID;

    const projectMembers = await projectService.getMembers(projectID);
    if (!projectMembers?.find((member) => member.id === req.user.id)) {
      return res.sendStatus(401);
    }

    const bug = await bugService.getBugByID(bugID);
    if (!bug) {
      return res.sendStatus(400);
    }

    return res.status(200).send(bug);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const commentID = req.params.commentID;
    const projectID = req.params.projectID;
    const { newDescription } = req.body;

    const projectMembers = await projectService.getMembers(projectID);
    const commentExists = await commentService.getCommentByID(commentID);

    if (!commentExists) {
      return res.status(400).send(`comment dosent exist`);
    }

    if (!projectMembers?.find((member) => member.id === req.user.id)) {
      return res.sendStatus(401);
    }

    const updatedComment = await commentService.editComment(
      commentID,
      newDescription
    );

    return res.status(201).send(updatedComment);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const commentID = req.params.commentID;
    const projectID = req.params.projectID;

    const commentExists = await commentService.getCommentByID(commentID);

    if (!commentExists) {
      return res.status(400).send(`comment dosent exist`);
    }

    const project = await projectService.getProjectByID(projectID);

    const canDelete =
      req.user.id === commentExists.createdByUserdId ||
      req.user.id === project?.createdByUserId;

    if (!canDelete) {
      return res.sendStatus(401);
    }
    await commentService.removeComment(commentID);

    return res.status(200).send(`comment deleted`);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};
