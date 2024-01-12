import { NextFunction, Request, Response } from "express";

export const validateCreateTicketMiddleware = (req: Request, res: Response, next: NextFunction)=>{
    
    const {title, description, category_id} = req.body;
    //Autor Misael: Este Middleware será refatorado para pegar o id do usuário autenticado
    if (!title) {return res.status(400).json({ ok: false, message: "O título é obrigatório!"});}
    if (!description) {return res.status(400).json({ ok: false, message: "A descrição é obrigatória!"});}
    if (!category_id) {return res.status(400).json({ ok: false, message: "A categoria é obrigatória!"});}    
    next();    
}