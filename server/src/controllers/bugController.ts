import { Request, Response } from 'express';
import userService from '../services/userService';
import projectService from '../services/projectService';
import bugService from '../services/bugService';
import commentService from '../services/commentService';

export const getUserBugs = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;

    const bugs = await userService.getUserBugs(userID);
    if (!bugs) {
      return res.sendStatus(400);
    }

    return res.status(200).send(bugs);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

export const getBugByID = async (req: Request, res: Response) => {
  try {
    const { bugID } = req.params;

    const bug = await bugService.getBugByID(bugID);
    if (!bug) {
      return res.sendStatus(400);
    }

    for (const comment of bug.comments) {
      const commentInfo = await commentService.getCommentByID(comment.id);

      if (commentInfo) {
        comment.creator = commentInfo.creator;
      }
    }

    return res.status(200).send(bug);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

export const getProjectBugs = async (req: Request, res: Response) => {
  try {
    const projectID = req.params.projectID;
    const projectMembers = await projectService.getMembers(projectID);

    if (!projectMembers) {
      return res.status(400).send('project dosent exist');
    }

    if (!projectMembers.find((member) => member.id === req.user.id)) {
      return res.sendStatus(401);
    }

    const bugs = await projectService.getProjectBugs(projectID);
    return res.status(200).send(bugs);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};

export const createBug = async (req: Request, res: Response) => {
  try {
    const creatorID = req.user.id;
    const projectID = req.params.projectID;
    const { title, description, priority } = req.body;
    const project = await projectService.getProjectByID(projectID);
    const projectMembers = await projectService.getMembers(projectID);
    const creator = await userService.getUserByID(creatorID);

    if (!creator || !project || !title || !description) {
      return res.status(400).send('invalid inputs');
    }

    if (!projectMembers?.find((member) => member.id === req.user.id)) {
      return res.sendStatus(401);
    }

    const bug = await bugService.addBug(
      title,
      description,
      creator,
      creatorID,
      project,
      priority
    );
    return res.status(200).send(bug);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

export const updateBug = async (req: Request, res: Response) => {
  try {
    const creatorID = req.user.id;
    const projectID = req.params.projectID;
    const bugID = req.params.bugID;
    const { title, description, priority } = req.body;
    const bug = await bugService.getBugByID(bugID);
    const project = await projectService.getProjectByID(projectID);
    const projectMembers = await projectService.getMembers(projectID);
    const creator = await userService.getUserByID(creatorID);

    if (!creator || !project) {
      return res.status(400).send('invalid inputs');
    }

    if (!projectMembers?.find((member) => member.id === req.user.id)) {
      return res.sendStatus(401);
    }

    const updatedBug = await bugService.updateBug(
      bugID,
      title || bug?.title,
      description || bug?.description,
      priority || bug?.priority
    );
    return res.status(200).send(updatedBug);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

export const deleteBug = async (req: Request, res: Response) => {
  try {
    const bugID = req.params.bugID;
    const projectID = req.params.projectID;
    const project = await projectService.getProjectByID(projectID);
    const bugExists = await bugService.getBugByID(bugID);

    if (!bugExists || !project) {
      return res.status(400).send(`bug dosent exist`);
    }

    const canDelete =
      req.user.id === bugExists.createdByUserId ||
      req.user.id === project.createdByUserId;

    if (!canDelete) {
      return res.sendStatus(401);
    }

    await bugService.removeBug(bugID);

    return res.status(200).send(`bug deleted`);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};

export const closeBug = async (req: Request, res: Response) => {
  try {
    const memberID = req.user.id;
    const bugID = req.params.bugID;
    const projectID = req.params.projectID;
    const member = await userService.getUserByID(memberID);
    const projectMembers = await projectService.getMembers(projectID);
    const bugExists = await bugService.getBugByID(bugID);

    if (!bugExists || !member) {
      return res.status(400).send(`invalid inputs`);
    }

    if (!projectMembers?.find((member) => member.id === req.user.id)) {
      return res.sendStatus(401);
    }

    const bug = await bugService.closeBug(bugID, member);

    for (const comment of bug!.comments) {
      const commentInfo = await commentService.getCommentByID(comment.id);

      if (commentInfo) {
        comment.creator = commentInfo.creator;
      }
    }

    return res.status(200).send(bug);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};

export const reOpenBug = async (req: Request, res: Response) => {
  try {
    const memberID = req.user.id;
    const bugID = req.params.bugID;
    const projectID = req.params.projectID;
    const member = await userService.getUserByID(memberID);
    const projectMembers = await projectService.getMembers(projectID);
    const bugExists = await bugService.getBugByID(bugID);

    if (!bugExists || !member) {
      return res.status(400).send(`bug dosent exist`);
    }

    if (!projectMembers?.find((member) => member.id === req.user.id)) {
      return res.sendStatus(401);
    }

    const bug = await bugService.openBug(bugID, member);

    for (const comment of bug!.comments) {
      const commentInfo = await commentService.getCommentByID(comment.id);

      if (commentInfo) {
        comment.creator = commentInfo.creator;
      }
    }

    return res.status(200).send(bug);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};
