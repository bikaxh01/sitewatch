import { Request, Response, response, Router } from "express";
import { sendResponse, STATUS } from "../utils/response";
import {
  createIncident,
  getAllIncident,
  getAllMonitors,
  getAllUrls,
  getMonitor,
  getMonitorIncidents,
  getMonitorStatus,
  getMonitorStats,
  registerMonitor,
  updateIncident,
  updateMonitorStatus,
  getAllIncidents,
  updateMonitor,
} from "../controllers/url.controller";
import { validateUser } from "../middleware/auth";
import { reqValidator } from "../middleware/reqValidator";
import { registerMonitorSchema } from "../types/zod";

export const urlRoute = Router();

urlRoute.get("/", (req: Request, res: Response) => {
  return sendResponse(res, STATUS.SUCCESS, "All Good ✅✅", []);
});

urlRoute.post(
  "/register-monitor",
  reqValidator(registerMonitorSchema),
  validateUser,
  registerMonitor
);

urlRoute.get("/get-all-monitors", validateUser, getAllMonitors);
urlRoute.get("/get-monitor", validateUser, getMonitor);
urlRoute.get("/get-monitor-status", validateUser, getMonitorStatus);
urlRoute.get("/get-monitor-incidents", validateUser, getMonitorIncidents);
urlRoute.get("/get-monitor-stats",validateUser,getMonitorStats)
urlRoute.get("/get-user-incidents",validateUser,getAllIncidents)
urlRoute.post("/update-monitor",validateUser,updateMonitor)

urlRoute.get("/internal/get-urls", getAllUrls);
urlRoute.patch("/internal/update-status", updateMonitorStatus);
urlRoute.post("/internal/create-incident", createIncident);
urlRoute.post("/internal/update-incident", updateIncident);
urlRoute.get("/internal/get-incident", validateUser, getAllIncident);
