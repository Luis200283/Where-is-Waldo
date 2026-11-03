import "dotenv/config";
import express from "express";
import path from "node:path";
import { indexRouter } from "./routes/indexRouter.ts";

const app = express();

const clientDist = path.join(import.meta.dirname, "client", "dist");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/api", indexRouter);

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Not found" });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(clientDist));
  app.get("/{*splat}", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

const PORT = Number(process.env.PORT) || 3000;

const server = app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});

server.on("error", (error) => {
  throw error;
});
