import express from "express";
import cors from "cors";
import morgan from "morgan";
import { env } from "./config/env.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
// import routes from "./routes/index.js"; // יחובר ברגע שתשלים את הראוטים

const app = express();

app.use(cors({ origin: env.CLIENT_URL }));
app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static(env.UPLOAD_DIR));

// app.use("/api", routes); 

app.use(notFound);
app.use(errorHandler);

export default app;