// imports
import express, { Application, Request, Response, NextFunction } from "express";
import http from "http";
import { Server } from "socket.io";
import "dotenv/config";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
// import bodyParser from "body-parser";
import createHttpError from "http-errors";
import { logger } from "./utils/index";

// constants
const port: number = parseInt(process.env.PORT || "8000");
const databaseUrl: string = process.env.DATABASE_URL || "";

const app: Application = express();
const server: http.Server = http.createServer(app);
const io: Server = new Server(server);

const allowedOrigins = ["http://localhost:3000"];

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// middlewares
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "tiny"));
app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(compression());
// app.use("/files", express.static("./files"));
// app.use("/api/v1", routes);

// error handling
app.use((req: Request, res: Response, next: NextFunction): void => {
  next(createHttpError.NotFound("This route doesn't exist"));
});

interface CustomError extends Error {
  status?: number;
}

app.use(
  (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
    res.status(err.status || 500);
    res.send({ error: { status: err.status || 500, message: err.message } });
  }
);

// handle unexpected errors
const exitHandler = (): void => {
  if (server) {
    logger.info("server closed");
  }
  process.exit(1);
};

const unexpectedErrorHandler = (error: Error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", (): void => {
  if (server) {
    logger.info("Server closed.");
    process.exit(1);
  }
});

// listening to server
server.listen(port, (): void => {
  logger.info("server listening to port " + port);
});
