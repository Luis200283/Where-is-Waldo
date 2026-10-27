import "dotenv/config";
import express from "express";
import { indexRouter } from "./routes/indexRouter.ts";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/", indexRouter);

const PORT = Number(process.env.PORT) || 3000;

const server = app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});

server.on("error", (error) => {
  throw error;
});
