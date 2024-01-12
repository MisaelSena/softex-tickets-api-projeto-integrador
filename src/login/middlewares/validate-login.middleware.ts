import { NextFunction, Request, Response } from "express";

export const validateLoginMiddleware = (req: Request, res: Response, next: NextFunction)=>{
    const {email, name, password} = req.body;

    if (!email) {return res.status(400).json({ ok: false, message: "O Email é obrigatório!" });}    
    if (!password) {return res.status(400).json({ ok: false, message: "A senha é obrigatória!" });}

    next();
}