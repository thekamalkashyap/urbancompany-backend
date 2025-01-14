import { Router } from "express";
import {
  getAllUsers,
  getUserProfile,
  updateInfo,
  bookService,
  listBookings,
  listAllBookings,
} from "../controllers/user";

const routes = Router();
routes.get("/bookings", listAllBookings);
routes.get("/", getAllUsers);
routes.get("/:id", getUserProfile);
routes.put("/:id", updateInfo);
routes.post("/book/:id", bookService);
routes.get("/bookings/:id", listBookings);

export default routes;
