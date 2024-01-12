import { Request, Response } from "express";
import prisma from "../../database/prismaClient";
import { ZodError } from "zod";


class CategoryGet {
    async getCategories(req:Request,res:Response){
        try{
            const categories = await prisma.category.findMany({
                orderBy:{id:"asc"},
                where:{deleted_at:null},
            });
            return res.status(200).json({categories});
        }catch(error){
            if(error instanceof ZodError) {
                return res
                .status(400)
                .json({message:"Error to get categories",error: error.issues});
            }
        }
    }
}

export default new CategoryGet()
