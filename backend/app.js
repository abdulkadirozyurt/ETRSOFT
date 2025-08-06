import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import accountsRouter from "./routes/account.routes.js";
import { syncData } from "./services/database.service.js";
import { connectDb, sequelize } from "./config/db.config.js";
import { apiReference } from "@scalar/express-api-reference";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

app.get("/openapi.json", (req, res) => {
  res.sendFile(join(__dirname, "openapi.json"));
});

// API referans arayüzünü, yukarıda oluşturulan URL'yi kullanacak şekilde yapılandır
app.use(
  "/scalar/v1",
  apiReference({
    theme: "mars",
    url: "/openapi.json",
  })
);

await connectDb();

setInterval(async () => {
  await syncData();
}, 3000);

app.use("/api/accounts", accountsRouter);

app.listen(process.env.PORT || 3000, async () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

export default app;
