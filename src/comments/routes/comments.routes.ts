import { Router } from "express";
import { validationAuth } from "../../commons/middlewares/auth.middleware";
import commentsPost from "../controllers/comments.post";
import commentsGet from "../controllers/comments.get";
import commentsPatch from "../controllers/comments.patch";
import commentsDelete from "../controllers/comments.delete";

export const commentsRoutes = (): Router => {
  const router = Router();

  router.post(
    "/tickets/:ticketId/comments",
    validationAuth,
    commentsPost.createComment
  );

  router.get(
    "/tickets/:ticketId/comments",
    validationAuth,
    commentsGet.getComments
  );

  router.patch(
    "/tickets/:ticketId/comments/:commentId",
    validationAuth,
    commentsPatch.updateComment
  );

  router.delete(
    "/tickets/:ticketId/comments/:commentId",
    validationAuth,
    commentsDelete.deleteComment
  );

  return router;
};
