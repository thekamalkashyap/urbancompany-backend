import { Router } from "express";
import { listCategories, updateCategory } from "../controllers/category";

const routes = Router();
routes.get("/", listCategories);
routes.put("/:category", updateCategory);
export default routes;
