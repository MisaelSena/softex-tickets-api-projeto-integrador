import { Request, Response, Router } from "express";
import { validateCreateUserMiddleware } from "../middlewares/validate-userCreate.middleware";
import UserController from "../controllers/user.controller";
import { validationAuth } from "../../commons/middlewares/auth.middleware";

export const UserRoutes = ():Router=>{
    
    const router = Router();

    router.post('/create',validateCreateUserMiddleware, UserController.createUser);
    //Rota apenas de teste de autenticação. Remover posteriormente
    router.get('/',validationAuth,(req:Request,res:Response)=>{
        console.log("Usuário está logado!");
        return res.status(200).send({ message: "Usuário está logado!" });
    });

    return router;
}