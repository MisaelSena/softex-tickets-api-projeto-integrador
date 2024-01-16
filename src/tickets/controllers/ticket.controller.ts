import { PrismaClient, Status, User } from "@prisma/client";
import { Request, Response } from "express";
import z from "zod";

const prisma = new PrismaClient();

class TicketController{
    //Autor Misael: Falta refatorar para pegar o user_id e as permissões do usuário autenticado pelo JWT
    async createTicket(req: Request, res:Response){
        const {title, description, category_id} = req.body;
        const userAuth = res.locals.user as User;
        const user_id = userAuth.id;

        const ticketSchema = z.object({
            title: z.string(),
            description: z.string(), 
            category_id: z.number(), 
            user_id: z.number()

        });

        try {
            //Autor Misael: O bloco de código comentado abaixo será reativado após a conclusão do CRUD de categoria.
            /*
            const category = await prisma.category.findUnique({
                where: { id: category_id },
            });
        
            const user = await prisma.user.findUnique({
                where: { id: user_id },
            });
        
            if (!category) {
                return res.status(400).json({ message: "Categoria informada não existe!" });
            }

            if (!user) {
                return res.status(400).json({ message: "Usuário não existe!" });
            }
            */
            ticketSchema.parse({title, description, category_id, user_id});

            const ticket = await prisma.ticket.create({
                data:{
                    title, 
                    description, 
                    category: {
                        connect:{id:category_id}
                    }, 
                    creator:{
                        connect:{id:user_id}
                    },
                },
            });

            await prisma.$disconnect();

            return res.status(201).json({ ok: true, message: "Ticket criado com sucesso!", ticket: ticket });
            
        } catch (error) {
            console.log(error, "Erro ao criar ticket");
            await prisma.$disconnect();            
            return res.status(400).json({ message: "Erro ao criar ticket" });
        }

    }

    //Autor Misael: Listagem de Todos os Tickets ou por status.
    async listAllTickets (req: Request, res: Response){
        const status = req.params.status as Status;
        try {
            if (!(status==="OPEN"||status==="IN_PROGRESS"||status==="RESOLVED"||status==="CLOSED")){
                const allTickets = await prisma.ticket.findMany({
                    where:{
                        deleted_at: {
                            equals: null,
                        }
                    },
                    select:{
                        id: true,
                        title: true,
                        description: true,
                        category: {select:{
                            id: true,
                            name: true,
                        }},
                        creator: {select:{
                            id: true,
                            name: true,
                        }},
                        comments: true,
                    }
                });
                return res.status(200).json({ ok: true, allTickets });
            }

            const ticketsByStatus = await prisma.ticket.findMany({
                where:{
                    status,
                    deleted_at: {
                        equals: null,
                    }
                },
                select:{
                    id: true,
                    title: true,
                    description: true,
                    category: {select:{
                        id: true,
                        name: true,
                    }},
                    creator: {select:{
                        id: true,
                        name: true,
                    }},
                    comments: true,
                }
            });

            if(ticketsByStatus.length<1){return res.status(404).json({ message: `Nenhum Ticket com Status ${status}` });}
            await prisma.$disconnect();
            return res.status(200).json({ ok: true, ticketsByStatus });

        } catch (error) {
            console.log(error, "Erro ao Listar Tickets!");
            console.log(status)            
            await prisma.$disconnect();
            return res.status(400).json({ message: "Erro ao Listar Tickets!" });
        }
    }
    //Autor Misael: Atribuição de AGENT ao ticket
    async assignAgentTicket(req: Request, res: Response){

        const {ticket_id} = req.params;
        const userAuth = res.locals.user as User;
        const assignee_id = userAuth.id;

        try {
            const ticket = await prisma.ticket.findUnique({where:{id:+ticket_id}});
            const assignee = await prisma.user.findUnique({where:{id:assignee_id}});
            
            if (!ticket) {
                return res.status(404).json({ message: "Ticket não encontrado!" });
                };
            
            if (ticket.assignee_id) {
                return res.status(400).json({ message: "O ticket já está atribuído a um agente!" });
            };

            if (!assignee) {
                return res.status(404).json({ message: "Usuário AGENT não encontrado para atribuir ao ticket!" });
                };         
            

            const assigneeTicket = await prisma.ticket.update({
                where:{id:+ticket_id},
                data:{
                    assignee_id,
                    status:"IN_PROGRESS",
                    updated_at: new Date(),
                },
            })
            await prisma.$disconnect();
            return res.status(200).json({ ok: true, assigneeTicket });
            
        } catch (error) {
            console.log(error, "Erro ao atribuir Ticket ao AGENT!");
            await prisma.$disconnect();
            return res.status(400).json({ message: "Erro ao atribuir Ticket ao AGENT!" });            
        }
    }
    //Autor Misael: Atualização de Status do Ticket
    async updateStatusTicket(req: Request, res: Response){
        const {ticket_id, status} = req.body;
        const userAuth = res.locals.user as User;
        const assignee_id = userAuth.id;

        try {
            const ticket = await prisma.ticket.findUnique({where:{id:ticket_id}});
            const assignee = await prisma.user.findUnique({where:{id:assignee_id}});
            
            if (!ticket || ticket.deleted_at === null) {
                return res.status(404).json({ message: "Ticket não encontrado!" });
                };
            
            if (ticket.assignee_id !== assignee_id) {
                return res.status(400).json({ message: "Você não é o AGENT deste Ticket!" });
            };

            if (!assignee) {
                return res.status(404).json({ message: "Usuário não encontrado para atualizar o ticket!" });
                };

            if (!(assignee.role==="AGENT" || assignee.role==="ADMIN")) {
                return res.status(403).json({ message: "Usuário não tem permissão para atualizar o ticket!" });
                };

            if (!(status==="IN_PROGRESS"||status==="RESOLVED"||status==="CLOSED")) {
                return res.status(404).json({ message: "Status informado inválido!" });
                };
            
            const updatedTicket = await prisma.ticket.update({
                where:{id:ticket_id},
                data:{                    
                    status,
                    updated_at: new Date(),
                },
            })
            
            await prisma.$disconnect();
            return res.status(200).json({ ok: true, updatedTicket });
            
        } catch (error) {
            console.log(error, "Erro ao atualizar Status do Ticket!");
            await prisma.$disconnect();
            return res.status(400).json({ message: "Erro ao atualizar Status do Ticket!" });
        }
    }

    //Autor Misael: Deletar Ticket
    async deleteTicket(req: Request, res: Response){
        const {ticket_id} = req.body;
        const userAuth = res.locals.user as User;
        const user_id = userAuth.id;

        try {
            const ticket = await prisma.ticket.findUnique({where:{id:ticket_id}});
            const user_admin = await prisma.user.findUnique({where:{id:user_id}});

            if (!ticket || ticket.deleted_at) {
                return res.status(404).json({ message: "Ticket não encontrado!" });
                };
            if(!user_admin){
                return res.status(404).json({ message: "Usuário não encontrado!" });
            }
            if(user_admin.role !== "ADMIN"){
                return res.status(403).json({ message: "Você não tem premissão de ADMIN para deleter o Ticket!" });
            }

            const deletedTicket = await prisma.ticket.update({
                where:{id:ticket_id},
                data:{                 
                    deleted_at: new Date(),
                },
            })
            
            await prisma.$disconnect();
            return res.status(200).json({ ok: true, deletedTicket });

        } catch (error) {
            console.log(error, "Erro ao deletar  Ticket!");
            await prisma.$disconnect();
            return res.status(400).json({ message: "Erro ao deletar  Ticket!" });
        }
    }
}

export default new TicketController();