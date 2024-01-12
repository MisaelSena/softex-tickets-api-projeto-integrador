import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

class GetUserController {
    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await prisma.user.findMany();
            res.json(users);
        } catch (error) {
            console.error('Erro ao obter usuários:', error);
            res.status(500).json({error: 'Erro ao obter usuários'});
        }
    }
}

export default new GetUserController();