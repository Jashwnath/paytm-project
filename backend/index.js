// backend/index.js
import express, { json } from "express";
import cors from "cors";
import rootRouter from "./routes/index.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();

app.use(cors());
app.use(json());

app.use("/api/v1", rootRouter);

app.listen(3000, () => {
  console.log("app running on port 3000");
});
