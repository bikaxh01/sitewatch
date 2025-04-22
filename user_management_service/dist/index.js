"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const url_route_1 = require("./routes/url.route");
const user_route_1 = require("./routes/user.route");
const response_1 = require("./utils/response");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
(0, dotenv_1.config)();
const PORT = process.env.PORT;
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
    optionSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
console.log("Running index 🟢🟢");
app.use("/api/user", user_route_1.userRoute);
app.use("/api/url", url_route_1.urlRoute);
app.get("/", (req, res) => {
    return (0, response_1.sendResponse)(res, response_1.STATUS.NOT_ALLOWED, "All Good ✔️✅", []);
});
app.listen(PORT, () => console.log(`Running at ${PORT} 🟢`));
