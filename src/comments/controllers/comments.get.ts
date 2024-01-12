import { Request, Response } from "express";
import prisma from "../../database/prismaClient";
import { ZodError } from "zod";

class CommentsGet {
  async getComments(req: Request, res: Response) {
    const { ticketId } = req.params;
    try {
      const comments = await prisma.comment.findMany({
        orderBy: { id: "asc" },
        where: { ticket_id: +ticketId, deleted_at: null },
        include: {
          ticket: {
            select: {
              id: true,
              commenter_text: true,
            },
          },
        },
      });
      return res.status(200).json({ comments });
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: "Validation error", error: error.issues });
      }
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default new CommentsGet();
