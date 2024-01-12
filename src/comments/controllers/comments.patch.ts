import { User } from "@prisma/client";
import { Request, Response } from "express";
import { ZodError, z } from "zod";
import prisma from "../../database/prismaClient";

class CommentPatch {
  async updateComment(req: Request, res: Response) {
    const { ticketId, commentId } = req.params;

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

      const comment = await prisma.comment.findUnique({
        where: { id: +commentId },
      });

      if (!comment) {
        return res.status(400).json({ message: "Comment not found" });
      }

      if (comment.commenter_id !== requestingUser.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const updatedComment = await prisma.comment.update({
        where: { id: +commentId },
        data: {
          commenter_text,
          commenter_id: requestingUser.id,
          updated_at: new Date(),
        },
      });

      return res.status(200).json({ message: "Comment updated" });
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(200)
          .json({ message: "Validation error", error: error.issues });
      }
      return res.status(500).json({ messagem: "Internal server error" });
    }
  }
}

export default new CommentPatch();
