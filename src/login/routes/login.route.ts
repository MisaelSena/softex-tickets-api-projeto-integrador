import { Router } from "express";
import LoginController from "../controllers/login.controller";
import { validateLoginMiddleware } from "../middlewares/validate-login.middleware";

export const LoginRoutes = ():Router=>{

    const router = Router();

    router.post('/',validateLoginMiddleware,LoginController.loginUser);

    return router;
}