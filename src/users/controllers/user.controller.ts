import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import z from "zod";

const prisma = new PrismaClient();

class UserController{
    async createUser(req: Request, res: Response){

        const {email, name, phone, password, role, commenterText } = req.body;

        const userSchema = z.object({
            email: z.string().email(),                    
            name:  z.string(),
            phone: z.string(),
            password: z.string(),
            role: z.string(),
            commenterText: z.string()
            
        });

        try {

            userSchema.parse({email, name, phone, password, role, commenterText});

            const existingUser = await prisma.user.findUnique({
                where: { email },
              });
            
              if (existingUser) {
                return res.status(409).json({ error: 'EmailAlreadyExists', message: 'O endereço de e-mail já está em uso por outro usuário.' });
              }           
            
            const user = await prisma.user.create({
                data:{
                    email,                    
                    name,
                    phone,
                    password_hash: bcrypt.hashSync(password,8),
                    role,
                    commenterText
                },
                
            });

            await prisma.$disconnect();

            return res.status(201).json({ ok: true, message: "Usuário criado com sucesso", user: user });
        } catch (error) {
            console.log(error, "Erro ao criar usuário");
            await prisma.$disconnect();
            process.exit(1)
            return res.status(400).json({ message: "Erro ao criar usuário" });
        }
    }
}

export default new UserController();