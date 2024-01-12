import { Request, Response } from "express";
import prisma from "../../database/prismaClient";
import { ZodError } from "zod";

class CommentsDelete {
  async deleteComment(req: Request, res: Response) {
    const { ticketId, commentId } = req.params;

    try {
      const requestingUser = res.locals.user;

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

      const deleteComment = await prisma.comment.update({
        where: { id: +commentId },
        data: {
          deleted_at: new Date(),
          commenter_id: requestingUser.id,
        },
      });
      return res.status(200).json({ message: "Comment deleted" });
    } catch (error) {
      if (error instanceof ZodError) {
        res
          .status(400)
          .json({ message: "Validation error", error: error.issues });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default new CommentsDelete();
