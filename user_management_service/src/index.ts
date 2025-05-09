import express, { Response, Request } from "express";
import cors from "cors";

import { config } from "dotenv";

import { urlRoute } from "./routes/url.route";
import { userRoute } from "./routes/user.route";
import { sendResponse, STATUS } from "./utils/response";
import cookieParser from "cookie-parser";

config();
const PORT = process.env.PORT;
const app = express();
app.use(cookieParser());
app.use(express.json());

const allowedOrigins = ["http://localhost:3000", "https://sitewatch.tech"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/api/user", userRoute);
app.use("/api/url", urlRoute);

app.get("/", (req: Request, res: Response) => {
  return sendResponse(res, STATUS.SUCCESS, "All Good v4 ready", []);
});

app.listen(PORT, () => console.log(`Running at ${PORT} 🟢`));
