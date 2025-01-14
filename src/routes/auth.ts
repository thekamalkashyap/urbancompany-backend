import { Router } from "express";
import { register, login, logout, deleteUser } from "../controllers/auth";

const routes = Router();
routes.post("/register", register);
routes.post("/login", login);
routes.get("/logout", logout);
routes.delete("/:id", deleteUser);

export default routes;
