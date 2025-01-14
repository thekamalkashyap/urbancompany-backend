import { PrismaClient } from "@prisma/client";
import logger from "./logger";

const prisma = new PrismaClient();

prisma.$connect().then(() => logger.info("Database connected!"));

export default prisma;
