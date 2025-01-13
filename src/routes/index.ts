import { Router } from "express";
import authRoutes from "./auth";
import userRoutes from "./user";
import serviceRoutes from "./service";
import categoryRoutes from "./category";

const routes = Router();
routes.get("/", (_, res) => res.send("Hello World!"));
routes.use("/auth", authRoutes);
routes.use("/user", userRoutes);
routes.use("/service", serviceRoutes);
routes.use("/category", categoryRoutes);

export default routes;
