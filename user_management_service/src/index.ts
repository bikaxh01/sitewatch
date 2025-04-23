import express, { Response, Request } from "express";
import cors from "cors";

import { config } from "dotenv";

import { urlRoute } from "./routes/url.route";
import { userRoute } from "./routes/user.route";
import { sendResponse, STATUS } from "./utils/response";
import cookieParser from "cookie-parser";

config();
const PORT = process.env.PORT ;
const app = express();
app.use(cookieParser());
app.use(express.json());


const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
 
};
app.use(cors(corsOptions));


app.use("/api/user", userRoute);
app.use("/api/url", urlRoute);

app.get("/", (req: Request, res: Response) => {
  return sendResponse(res, STATUS.SUCCESS, "All Good v3 ready", []);
});

app.listen(PORT, () => console.log(`Running at ${PORT} 🟢`));
