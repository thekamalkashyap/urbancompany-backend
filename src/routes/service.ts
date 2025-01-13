import { Router } from "express";
import {
  addService,
  listServices,
  updateService,
  getService,
  getServiceOfCategory,
  deleteService,
} from "../controllers/service";

const routes = Router();
routes.post("/", addService);
routes.get("/", listServices);
routes.get("/:id", getService);
routes.get("/category/:category", getServiceOfCategory);
routes.put("/:id", updateService);
routes.delete("/:id", deleteService);

export default routes;
