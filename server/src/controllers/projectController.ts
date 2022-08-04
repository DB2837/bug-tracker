import { Project } from './../models/Project';
import { Request, Response } from 'express';
import userService from '../services/userService';
import projectService from '../services/projectService';
import bugService from '../services/bugService';

export const getProjects = async (_req: Request, res: Response) => {
  try {
    const projects = await projectService.getAllProjects();
    return res.status(200).send(projects);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};

export const getUserProjects = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;
    const user = await userService.getUserByID(userID);

    if (!user) {
      return res.status(400).send('invalid user');
    }

    const userProjects = await userService.getUserProjects(user.id);
    const projects: Project[] = [];

    for (const p of userProjects!) {
      const project = await projectService.getProjectInfo(p.id);
      project && projects.push(project);
    }

    return res.status(200).json(projects);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};

export const getProjectByID = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;
    const user = await userService.getUserByID(userID);

    if (!user) {
      return res.status(400).send('invalid user');
    }
    const projectID = req.params.projectID;
    const project = await projectService.getProjectByID(projectID);

    if (!project) {
      return res.status(400);
    }

    for (const bug of project.bugs) {
      const bugInfo = await bugService.getBugByID(bug.id);

      if (bugInfo) {
        bug.createdBy = bugInfo.createdBy;
        bug.comments = bugInfo.comments;
      }
    }

    return res.status(200).json(project);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};

export const addProject = async (req: Request, res: Response) => {
  try {
    const projectCreatorEmail = req.user.email;
    const { membersEmails, title } = req.body;
    const emails = [projectCreatorEmail, ...membersEmails];
    const users = await userService.getUsersByEmails(emails);

    if (users && users.length === emails.length && title) {
      const [projectOwner, ...members] = users;

      const project = await projectService.addProject(
        title,
        projectOwner,
        projectOwner.id,
        members
      );

      return res.status(200).send(project);
    }

    return res.status(400).send('invalid users or title');
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

export const leaveProject = async (req: Request, res: Response) => {
  try {
    const projectID = req.params.projectID;
    const memberID = req.user.id;

    const project = await projectService.removeMember(projectID, memberID);
    if (!project) {
      return res.status(400).send('invalid projectID or memberID');
    }

    return res.status(200).send(project);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};

export const updateMembers = async (req: Request, res: Response) => {
  try {
    const projectID = req.params.projectID;
    const { membersEmails } = req.body;
    /* const projectOwnerEmail = await userService
      .getUserByID(req.user.id)
      .then((user) => user?.email);
 */
    /* membersEmails.push(projectOwnerEmail); */

    const membersArr = await userService.getUsersByEmails(membersEmails);
    const projectExists = await projectService.getProjectByID(projectID);

    if (!membersArr || !projectExists) {
      return res.status(400).send('invalid projectID or members');
    }

    const projectOwnerID = projectExists.createdByUserId;

    if (projectOwnerID !== req.user.id) {
      return res.status(401).send('Only project owner can make update request');
    }

    //emails must include project owner email
    if (!membersArr.find((user) => user.id === projectOwnerID)) {
      return res.status(401).send('project owner must be inside members');
    }

    if (
      projectExists &&
      membersArr &&
      membersArr.length === membersEmails.length
    ) {
      const modifedProject = await projectService.updateMembers(
        projectID,
        membersArr
      );

      return res.status(200).send(modifedProject);
    }

    return res.status(400).send('invalid emails or projectID');
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};

export const updateProjectTitle = async (req: Request, res: Response) => {
  try {
    //req.user.id to validate the request
    const projectID = req.params.projectID;
    const projectExists = await projectService.getProjectByID(projectID);

    if (!projectExists) {
      return res.status(400).send({ message: 'project dosent exists' });
    }

    if (projectExists.createdByUserId !== req.user.id) {
      return res
        .status(403)
        .send({ message: 'only project owner can update it' });
    }

    const { newTitle } = req.body;
    const modifedProject = await projectService.editProjectTitle(
      projectID,
      newTitle
    );

    return res.status(200).send(modifedProject);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const projectID = req.params.projectID;
    const projectExists = await projectService.getProjectByID(projectID);

    if (!projectExists) {
      return res.status(400).send(`invalid projectID`);
    }

    if (projectExists.createdByUserId !== req.user.id) {
      return res
        .status(403)
        .send({ message: 'only project owner can delete it' });
    }

    await projectService.deleteProject(projectID);

    return res.status(200).send(`project deleted`);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};
