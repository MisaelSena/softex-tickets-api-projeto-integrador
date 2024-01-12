import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

class LoginController {
  async loginUser(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { 
            id: true,
            name: true,
            email:true,
            password_hash:true,
         },
      });

      if (!user) {return res.status(404).json({ ok: false, error: "Usuário ou Senha inválidos!" });}

      if(!bcrypt.compareSync(password,user.password_hash)){return res.status(401).json({ ok: false, error: "Usuário ou Senha inválidos!" });}
      
      const token = jwt.sign({ id: user.id },process.env.JWT_SECRET as string,{ expiresIn: "1d" });

      return res.status(200).json({ ok: true, token });
    } catch (error) {
        console.log(error, "Erro na autenticação de usuário");
        res.status(500).send({ ok: false, error: "Erro na autenticação de usuário" });
    }
  }
}

export default new LoginController();
