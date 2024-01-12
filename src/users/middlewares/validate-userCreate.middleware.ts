import { NextFunction, Request, Response } from "express";

export const validateCreateUserMiddleware = (req: Request, res: Response, next: NextFunction)=>{
    const {email, name, password, role, commenterText} = req.body;

    if (!email) {return res.status(400).json({ ok: false, message: "O Email é obrigatório!" });}
    if (!name) {return res.status(400).json({ ok: false, message: "O nome é obrigatório!" });}
    if (!password) {return res.status(400).json({ ok: false, message: "A senha é obrigatória!" });}
    if (!role) {return res.status(400).json({ ok: false, message: "A permissão de usuário é obrigatória!" });}
    if (!commenterText) {return res.status(400).json({ ok: false, message: "O Comentário é obrigatório!" });}

    next();
}