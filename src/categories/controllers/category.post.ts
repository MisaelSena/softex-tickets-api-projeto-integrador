import { Request, Response } from "express";
import {z,ZodError} from "zod";
import prisma from "../../database/prismaClient";



class CategoryPost {
    async createCategory(req:Request,res:Response) {
        try{    
            const bodySchema = z.object({
                name: z.string(),
                commenter_text: z.string(),
            });
            
            const {name , commenter_text} = bodySchema.parse(req.body);
            const category = await prisma.category.create({
                data:{
                    name,
                    commenter_text,
                },
            });
            return res.status(201).json({message:"Category created!"})
        }catch(error){
            if (error instanceof ZodError){
                return res
                .status(400)
                .json({message:"Error"})
            }
            return res.status(500).json({message:"Internal server error!"})
        }
    }
}

export default new CategoryPost ()
