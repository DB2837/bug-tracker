import { getUsers } from '../../controllers/userController';
import express, { Router } from 'express';

const router: Router = express.Router();

router.get('/', getUsers);

export default router;
