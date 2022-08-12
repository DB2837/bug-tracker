import {
  postComment,
  deleteComment,
  updateComment,
  getComments,
} from '../../controllers/commentController';
import express, { Router } from 'express';

const router: Router = express.Router();

router.get('/:projectID/bugs/:bugID/comments', getComments);
router.post('/:projectID/bugs/:bugID/comments', postComment);
router.delete('/:projectID/comments/:commentID', deleteComment);
router.patch('/:projectID/comments/:commentID', updateComment);

export default router;
