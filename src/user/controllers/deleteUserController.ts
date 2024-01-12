import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

class DeleteUserController {
    async DeleteUser(req: Request, res: Response) {
        const userID = parseInt(req.params.id, 10);

        try {
            await prisma.user.delete({
                where: { id: userID },
            });
            res.json({ message: 'Usuário excluído com sucesso'});
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            res.status(500).json({ error: 'Erro ao excluir usuário'});
        }
    }
}

export default new DeleteUserController();