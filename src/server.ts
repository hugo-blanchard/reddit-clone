import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import trim from "./middleware/trim";

import authRoutes from "./routes/auth";
import postsRoutes from "./routes/posts";
import subsRoutes from "./routes/subs";
import miscRoutes from "./routes/misc";
import usersRoutes from "./routes/users";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(morgan("dev"));
app.use(trim);
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200,
  })
);
app.use(express.static("public"));

app.get("/", (_, res) => res.send("Hello World"));
app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/subs", subsRoutes);
app.use("/api/misc", miscRoutes);
app.use("/api/users", usersRoutes);

app.listen(PORT, async () => {
  console.log("Server running at http://localhost:5000");

  try {
    await createConnection();
    console.log("Database connected!");
  } catch (err) {
    console.log(err);
  }
});
