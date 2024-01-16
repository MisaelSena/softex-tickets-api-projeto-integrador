import { Router } from "express";
import TicketController from "../controllers/ticket.controller";
import { validateCreateTicketMiddleware } from "../middlewares/validate-ticketCreate.middleware";
import { validationAuth } from "../../commons/middlewares/auth.middleware";

export const TicketRoutes = ():Router=>{
    const router = Router();

    router.post('/create',validationAuth,validateCreateTicketMiddleware,TicketController.createTicket);
    //Autor Misael: Para Listar os Tickets pelo status, passe o parâmetro pels url.
    router.get('/view/:status?',validationAuth,TicketController.listAllTickets);
    //Autor Misael: Rota para atribuir AGENT ao Ticket
    router.patch('/assigneeAgentTicket',validationAuth,TicketController.assignAgentTicket);
    //Autor Misael: Rota para atualização de Status do Ticket
    router.patch('/updateStatusTicket',validationAuth,TicketController.updateStatusTicket);
    //Autor Misael: Rota para ADMIN deletar Ticket
    router.delete('/deleteTicket',validationAuth,TicketController.deleteTicket);

    return router;
}