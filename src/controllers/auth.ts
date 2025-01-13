import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import validator from "validator";
import { jwt, prisma } from "../utils";
import * as argon2 from "argon2";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createHttpError.BadRequest("Please provide email and password.");
    }

    if (!validator.isEmail(email)) {
      throw createHttpError.BadRequest("Invalid email address.");
    }

    const checkDb = await prisma.user.findUnique({ where: { email } });

    if (checkDb) {
      createHttpError.Conflict("User already exists.");
    }

    const hashedPassword = await argon2.hash(password);

    const user = await prisma.user.create({
      data: {
        ...req.body,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      throw createHttpError.BadRequest("Please provide email address.");
    }

    if (!validator.isEmail(email)) {
      throw createHttpError.BadRequest("invalid email address.");
    }

    const checkDb = await prisma.user.findUnique({ where: { email } });
    if (!checkDb) {
      console.log("User doesnt exists");
    } else {
      if (!(await argon2.verify(checkDb.password, password))) {
        return res.status(401).json({ message: "Password does not match" });
      }

      if (checkDb?.isDeleted) {
        await prisma.user.update({
          where: { email },
          data: { isDeleted: false },
        });
      }

      const accessToken = await jwt.sign(
        {
          userId: checkDb.id,
        },
        "30d",
        process.env.ACCESS_TOKEN_SECRET || ""
      );

      res.cookie("accessToken", accessToken, {});
    }

    return res.status(200).json({
      message: "User authenticated successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("accessToken", {});
    res.status(200).json({ message: "User logged out successfully." });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const user = await prisma.user.update({
      where: { id },
      data: { isDeleted: true },
    });

    if (!user) {
      createHttpError.BadRequest("No such user found");
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    next(error);
  }
};
