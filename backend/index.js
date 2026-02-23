// backend/index.js
import express from "express";
import cors from "cors";
import rootRouter from "./routes/index.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/v1", rootRouter);

app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
