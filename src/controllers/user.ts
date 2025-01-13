import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { prisma } from "../utils";
import { Role } from "@prisma/client";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await prisma.user.findMany();
    if (!users) {
      throw createHttpError.BadRequest("No user found");
    }
    res.status(200).json({ data: users });
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw createHttpError.BadRequest("No user found");
    }

    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
};

export const updateInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    req.body.updatedAt = Date.now();

    await prisma.user.update({
      where: { id },
      data: { ...req.body },
    });

    res.status(200).json({ message: "user updated" });
  } catch (error) {
    next(error);
  }
};

export const bookService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userID = parseInt(req.params.id);
    const { serviceID, vendorID } = req.body;
    const service = await prisma.service.findUnique({
      where: { id: serviceID },
    });
    const vendor = await prisma.user.findUnique({
      where: { id: vendorID, userType: Role.VENDOR },
    });
    const user = await prisma.user.findUnique({ where: { id: userID } });

    if (!service || !vendor || !user) {
      throw createHttpError.BadRequest("Invalid Request");
    } else {
      const total = req.body.qty * service.price;
      req.body.totalPrice = total;
      req.body.userID = userID;
      const booking = await prisma.booking.create({
        data: { ...req.body },
      });
      res.status(200).json({
        message: "Service Booked",
        invoice: booking,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const listBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const bookings = await prisma.booking.findMany({
      where: { userID: id },
    });

    if (!bookings) {
      throw createHttpError.BadRequest("Invalid request");
    } else {
      res.status(200).json({
        message: "Your bookings",
        bookings,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const listAllBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookings = await prisma.booking.findMany();

    if (!bookings) {
      throw createHttpError.BadRequest("No bookings found");
    } else {
      res.status(200).json({
        message: "Bookings",
        bookings,
      });
    }
  } catch (error) {
    next(error);
  }
};
