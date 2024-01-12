import { Request, Response } from "express";
import { ZodError, z } from "zod";
import prisma from "../../database/prismaClient";



class CategoryDelete {
    async deleteCategory(req:Request,res:Response){
        try{
            const paramsSchema = z.object({
                id: z.string(),
            });
            const {id} = paramsSchema.parse(req.params);

            const category = await prisma.category.findUnique({
                where:{id:parseInt(id)},
            });

            if(!category){
                return res.status(400).json({message:"Category not found"});
            }

            const deletedCategory = await prisma.category.update({
                where: {id: parseInt(id)},
                data: {
                    deleted_at: new Date(),
                }
            });
            return res.status(200).json({message:"Post deleted"});
        }catch(error) {
            if (error instanceof ZodError) {
                return res 
                .status(400)
                .json({message:"validation error", error: error.issues});
            }
            return res.status(500).json({message:"Internal server error"});
        }
    }
}

export default new CategoryDelete();