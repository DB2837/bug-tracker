import {
  getUserBugs,
  createBug,
  deleteBug,
  closeBug,
  reOpenBug,
  getProjectBugs,
  getBugByID,
  updateBug,
} from '../../controllers/bugController';
import express, { Router } from 'express';

const router: Router = express.Router();

router.get('/:projectID/bugs', getProjectBugs);
router.post('/:projectID/bugs', createBug);
router.get('/:projectID/bugs/:bugID', getBugByID);
router.delete('/:projectID/bugs/:bugID', deleteBug);
router.patch('/:projectID/bugs/:bugID/update', updateBug);
router.patch('/:projectID/bugs/:bugID/close', closeBug);
router.patch('/:projectID/bugs/:bugID/open', reOpenBug);

router.get('/:userID', getUserBugs);

export default router;
