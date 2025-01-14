import { prisma } from "../utils";
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { Role } from "@prisma/client";

const isVendor = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
  if (!user || user.userType !== Role.VENDOR) {
    throw createHttpError.BadRequest("VendorID is invalid");
  } else {
    return Promise.resolve();
  }
};

export const addService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await isVendor(req.body.vendorID);
    const service = await prisma.service.create({
      data: { ...req.body },
    });
    res.status(200).json({ message: "Service Added", data: service });
  } catch (error) {
    next(error);
  }
};

export const listServices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const services = await prisma.service.findMany();
    if (!services) {
      throw createHttpError.BadRequest("No services found");
    }
    res.status(200).json({ data: services });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    if (req.body.vendorID) {
      await isVendor(req.body.vendorID);
    }
    const service = await prisma.service.update({
      where: { id },
      data: { ...req.body },
    });

    if (!service) {
      throw createHttpError.BadRequest("Service not found");
    } else {
      res.status(200).json({
        message: "Service Updated",
        data: service,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) {
      throw createHttpError.BadRequest("Service not found");
    } else {
      res.status(200).json({ data: service });
    }
  } catch (error) {
    next(error);
  }
};

export const getServiceOfCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoryName = req.params.category;
    const services = await prisma.service.findMany({
      where: { categoryID: categoryName },
    });
    if (!services) {
      throw createHttpError.BadRequest("No service found");
    } else {
      res.status(200).json({ data: services });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const service = await prisma.service.delete({ where: { id } });
    if (!service) {
      throw createHttpError.BadRequest("Service not found");
    } else {
      res.status(200).json({ message: "Service Deleted" });
    }
  } catch (error) {
    next(error);
  }
};
