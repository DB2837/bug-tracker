import {
  addProject,
  deleteProject,
  getProjects,
  getUserProjects,
  updateProjectTitle,
  updateMembers,
  getProjectByID,
  leaveProject,
} from '../../controllers/projectController';
import express, { Router } from 'express';

const router: Router = express.Router();

router.get('/allProjects', getProjects); //just for testing
router.get('/', getUserProjects);
router.post('/', addProject);
router.get('/:projectID', getProjectByID);
router.patch('/:projectID', updateProjectTitle);
router.delete('/:projectID', deleteProject);
router.patch('/:projectID/addmembers', updateMembers);
router.post('/:projectID/leave', leaveProject);

export default router;
