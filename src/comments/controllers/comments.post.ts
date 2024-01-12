import { User } from "@prisma/client";
import { Request, Response } from "express";
import { z, ZodError } from "zod";
import prisma from "../../database/prismaClient";

class CommentsPost {
  async createComment(req: Request, res: Response) {
    const { ticketId } = req.params;
    try {
      const requestingUser = res.locals.user as User;

      const bodySchema = z.object({
        commenter_text: z.string(),
      });

      const { commenter_text } = bodySchema.parse(req.body);
      const ticket = await prisma.ticket.findUnique({
        where: { id: +ticketId },
      });

      if (!ticket) {
        return res.status(400).json({ message: "Ticket not found" });
      }

      const comment = await prisma.comment.create({
        data: {
          commenter_text: commenter_text,
          ticket_id: +ticketId,
          commenter_id: requestingUser.id,
        },
      });
      return res.status(201).json({ message: "Comment created" });
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: "Validation error", error: error.issues });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default new CommentsPost();
