import { Request, Response } from "express";
import {z,ZodError} from "zod";
import prisma from "../../database/prismaClient";




class CategoryPatch{
    async updateCategory(req:Request,res:Response) {
        try{
            const paramsSchema = z.object({
                id: z.string(),
            });
            const bodySchema = z.object({
                name: z.string(),
                description: z.string(),
            });

            const{id} = paramsSchema.parse(req.params);
            const{name, description} = bodySchema.parse(req.body)
            
            const category = await prisma.category.findUnique({
                where:{id: parseInt(id)},
            });

            if(!category){
                return res.status(400).json({message:"Category not found"})
            }

            const updatedCategory = await prisma.category.update({
                where: {id: +id},
                data:{
                    name,
                    description,
                    updated_at: new Date(),
                }
            });
            return res.status(200).json({message: "Category update"});
        }catch(error) {
            if (error instanceof ZodError){
                return res
                .status(400)
                .json({message:"Validation error",error: error.issues});
            }
            return res.status(500).json({message:"Internal server error"});
        }
    }
}

export default new CategoryPatch()