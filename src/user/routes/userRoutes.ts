import express from 'express';
import { Request, Response } from "express";
import GetUserController from '../controllers/getUserController';
import DeleteUserController from '../controllers/deleteUserController';

const router = express.Router();

router.get('/users', (req: Request, res: Response) => GetUserController.getAllUsers(req, res));
router.delete('/users/:id', (req: Request, res: Response) => DeleteUserController.DeleteUser(req, res));

export default router;