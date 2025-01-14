import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { prisma } from "../utils";
import { Role } from "@prisma/client";

export const userAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies["accessToken"];
  if (!token) {
    return next(createHttpError.Unauthorized());
  }
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET || "",
    (error: any, payload: any) => {
      if (error) {
        return next(createHttpError.Unauthorized());
      }
      req.user = payload;
      next();
    }
  );
};

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies["accessToken"];
  if (!token) {
    return next(createHttpError.Unauthorized());
  }
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET || "",
    async (error: any, payload: any) => {
      if (error) {
        return next(createHttpError.Unauthorized());
      }
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });
      if (!user || user.userType !== Role.ADMIN) {
        return next(createHttpError.Unauthorized());
      }
      req.user = payload;
      next();
    }
  );
};
