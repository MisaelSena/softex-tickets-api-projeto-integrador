import { Router } from "express";
import { validationAuth } from "../../commons/middlewares/auth.middleware";
import commentsPost from "../controllers/comments.post";
import commentsGet from "../controllers/comments.get";
import commentsPatch from "../controllers/comments.patch";
import commentsDelete from "../controllers/comments.delete";

export const commentsRoutes = (): Router => {
  const router = Router();

  router.post(
    "/tickets/:ticket_id/comments",
    validationAuth,
    commentsPost.createComment
  );

  router.get(
    "/tickets/:ticket_id/comments",
    validationAuth,
    commentsGet.getComments
  );

  router.patch(
    "/tickets/:ticket_id/comments/:commentId",
    validationAuth,
    commentsPatch.updateComment
  );

  router.delete(
    "/tickets/:ticket_id/comments/:commentId",
    validationAuth,
    commentsDelete.deleteComment
  );

  return router;
};
