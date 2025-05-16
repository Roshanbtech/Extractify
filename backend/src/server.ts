import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import * as rfs from "rotating-file-stream";
import cookieParser from "cookie-parser";
import { createServer } from "http";

import connectDB from "./config/dbConfig";
import authRoutes from "./interface-adapters/routes/authRoutes";
import pdfRoutes from "./interface-adapters/routes/pdfRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { authenticate } from "./middleware/authenticate";

dotenv.config();

const app = express();
const server = createServer(app);

connectDB();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const logDirectory = path.join(__dirname, "logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const accessLogStream = rfs.createStream("access.log", {
  interval: "1d",
  path: logDirectory,
});

app.use(
  morgan("combined", {
    stream: accessLogStream,
    skip: (req: Request, res: Response) => res.statusCode < 400,
  })
);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});


console.log('Allowed CORS Origin:', process.env.FRONTEND_URL);

const corsOptions = {
  origin: process.env.FRONTEND_URL ||"https://extractify-91.vercel.app" ,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "Content-Type",
    "Accept",
    "Authorization",
    "X-Requested-With",
  ],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));


app.use("/api/auth", authRoutes);
app.use("/api/pdf", authenticate, pdfRoutes); 

app.use(
  (err: unknown, req: Request, res: Response, next: NextFunction): void => {
    errorHandler(err, req, res, next);
  }
);

// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

export default app;
