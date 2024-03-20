import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import submissionRouter from "./routes/submissionRouter.js";

export const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/submission", submissionRouter);

app.get("/", (req, res) => {
  res.send("hi");
});

//Error Middleware
// app.use(error);
