import { Router } from "express";

import { validationAuth } from "../../commons/middlewares/auth.middleware";
import categoryPost from "../controllers/category.post";
import categoryGet from "../controllers/category.get";
import categoryPatch from "../controllers/category.patch";
import categoryDelete from "../controllers/category.delete";


export const categoriesRoutes = (): Router => {
    const router = Router();

    router.post("/categories", validationAuth, categoryPost.createCategory);
    router.get("/categories", validationAuth, categoryGet.getCategories);
    router.patch("/category/:categoryId", validationAuth, categoryPatch.updateCategory);
    router.delete("/category/:categoryId", validationAuth, categoryDelete.deleteCategory);

    return router;
};
