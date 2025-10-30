import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { v1_router } from "./route/v1_route";
import { PORT } from "./config/dotenv.config";
import { corsOptions } from "./util/cors.util";

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", v1_router);

app.listen(PORT, () => {
  console.log(`Alive at http://localhost:${PORT}`);
});
