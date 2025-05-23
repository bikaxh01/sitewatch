import { Request, response, Response } from "express";

import { sendResponse, STATUS } from "../utils/response";
import { formatTime, prisma } from "../config/db";
import { redisClient } from "../config/redis";
import { urlStatus } from "@prisma/client";
import { StatsParams } from "../config/influx";
import { getUrlStat, lastChecked } from "../config/influx";
import { logger } from "../config/log";
import { string } from "zod";

export async function registerMonitor(req: Request, res: Response) {
  const { userId, url, monitorName, checkInterval } = req.body;

  try {
    // get domain
    const urlSplit = url.split("/");

    const domain = urlSplit[2];

    const monitor = await prisma.monitor.create({
      data: {
        url,
        domain,
        monitorName,
        checkInterval: Number(checkInterval),
        userId,
      },
      select: {
        id: true,
        url: true,
        domain: true,
        status: true,
        checkInterval: true,
        monitorName: true,
      },
    });

    const nextCheckTime = Date.now();

    const redis = await redisClient.zAdd("monitoring:urls", [
      { value: JSON.stringify({ ...monitor }), score: nextCheckTime },
    ]);

    sendResponse(
      res,
      STATUS.SUCCESS,
      "Monitor registered successfully",
      monitor
    );
  } catch (error) {
    sendResponse(
      res,
      STATUS.INTERNAL_ERROR,
      "something went wrong while monitoring"
    );
  }
}

export async function updateMonitorStatus(req: Request, res: Response) {
  try {
    const { urlId, status } = req.query;

    if (!urlId || !status) {
      return sendResponse(res, STATUS.NOT_ALLOWED, "Invalid Query");
    }

    const isExists = await prisma.monitor.findUnique({
      where: {
        id: urlId as string,
      },
    });

    if (!isExists) {
      return sendResponse(res, STATUS.NOT_FOUND, "Invalid url id");
    }

    const update = await prisma.monitor.update({
      where: {
        id: urlId as string,
      },
      data: {
        status: status as urlStatus,
      },
    });

    return sendResponse(res, STATUS.SUCCESS, "successfully updated");
  } catch (error) {
    return sendResponse(res, STATUS.INTERNAL_ERROR, "something went wrong");
  }
}

export async function createIncident(req: Request, res: Response) {
  try {
    const { urlId, startTime, imageUrl } = req.body;

    if (!urlId || !startTime) {
      return sendResponse(res, STATUS.NOT_ALLOWED, "Invalid query");
    }

    const isExists = await prisma.monitor.findUnique({
      where: {
        id: urlId as string,
      },
    });

    if (!isExists) {
      return sendResponse(res, STATUS.NOT_FOUND, "Invalid url id");
    }

    const createIncident = await prisma.incident.create({
      data: {
        urlId: urlId as string,
        startTime: new Date(startTime),
        imageUrl,
      },
    });

    return sendResponse(
      res,
      STATUS.CREATED,
      "Incident created",
      createIncident
    );
  } catch (error) {
    logger.error("🚀 ~ createIncident ~ error:", error);
    return sendResponse(
      res,
      STATUS.INTERNAL_ERROR,
      "Something went wrong while creating incident"
    );
  }
}

export async function updateIncident(req: Request, res: Response) {
  try {
    const { urlId, endTime } = req.body;

    if (!urlId || !endTime) {
      return sendResponse(res, STATUS.NOT_ALLOWED, "Invalid query");
    }

    const latestIncident = await prisma.incident.findMany({
      where: {
        urlId: urlId as string,
      },
      orderBy: { createdAt: "desc" },
      take: 1,
    });

    if (latestIncident.length <= 0) {
      return sendResponse(res, STATUS.NOT_FOUND, "no incidents found");
    }
    //@ts-ignore
    const duration = new Date(endTime) - new Date(latestIncident[0].startTime);

    const incident = await prisma.incident.update({
      where: {
        id: latestIncident[0].id,
      },
      data: {
        //@ts-ignore
        endTime: new Date(endTime),
        duration: duration,
      },
    });

    return sendResponse(res, STATUS.SUCCESS, "Incident updated", incident);
  } catch (error) {
    return sendResponse(
      res,
      STATUS.INTERNAL_ERROR,
      "error while Incident updated"
    );
  }
}

export async function getAllUrls(req: Request, res: Response) {
  try {
    const urlsToBeChecked = await prisma.monitor.findMany({
      where: {},
      select: {
        id: true,
        url: true,
        domain: true,
        status: true,
        checkInterval: true,
        monitorName: true,
      },
    });

    return sendResponse(
      res,
      STATUS.SUCCESS,
      "Successfully fetched",
      urlsToBeChecked
    );
  } catch (error) {
    logger.error("🚀 ~ getAllUrls ~ error:", error);
    return sendResponse(res, STATUS.INTERNAL_ERROR, "something went wrong");
  }
}

export async function getAllIncident(req: Request, res: Response) {
  try {
    const userId = req.body.userId;
    if (!userId) {
      return sendResponse(
        res,
        STATUS.NOT_ALLOWED,
        "User ID not found in cookies"
      );
    }
    const monitor = await prisma.monitor.findMany({
      where: {
        userId: userId,
      },
    });
    if (!monitor) {
      return sendResponse(
        res,
        STATUS.NOT_ALLOWED,
        "Please create website to monitor"
      );
    }
    return sendResponse(res, STATUS.SUCCESS, "successfully", monitor);
  } catch (error) {
    logger.error("🚀 ~ getAllIncident ~ error:", error);
    return sendResponse(res, STATUS.INTERNAL_ERROR, "something went wrong");
  }
}

export const getAllMonitors = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    const monitors = await prisma.monitor.findMany({
      where: {
        userId,
      },
    });

    return sendResponse(res, STATUS.SUCCESS, "Successfully fetched", monitors);
  } catch (error) {
    return sendResponse(res, STATUS.INTERNAL_ERROR, "something went wrong");
  }
};

export const getMonitor = async (req: Request, res: Response) => {
  try {
    const { monitorId } = req.query;
    const { userId } = req.body;

    if (!monitorId || typeof monitorId !== "string") {
      return sendResponse(res, STATUS.INVALID_DATA, "Invalid monitor Id");
    }

    const monitor = await prisma.monitor.findUnique({
      where: {
        id: monitorId,
        userId,
      },
      include: {
        _count: {
          select: {
            Incident: true,
          },
        },
      },
    });

    if (!monitor) {
      return sendResponse(res, STATUS.NOT_FOUND, "No monitor found");
    }

    const lastCheck = await lastChecked(monitor.id);

    const resData = {
      monitorDetails: monitor,
      status: monitor.status,
      incidentCount: monitor._count.Incident,
      lastChecked: lastCheck ? lastCheck.time : Date.now(),
    };

    return sendResponse(res, STATUS.SUCCESS, "Successfully fetched", resData);
  } catch (error) {
    logger.error("🚀 ~ getMonitor ~ error:", error);
    return sendResponse(res, STATUS.INTERNAL_ERROR, "something went wrong");
  }
};

export const getMonitorStatus = async (req: Request, res: Response) => {
  try {
    const { monitorId } = req.query;
    const { userId } = req.body;

    if (!monitorId || typeof monitorId !== "string") {
      return sendResponse(res, STATUS.INVALID_DATA, "Invalid monitor Id");
    }

    const monitorStatus = await prisma.monitor.findUnique({
      where: {
        id: monitorId,
        userId,
      },
      include: {
        _count: {
          select: {
            Incident: true,
          },
        },
      },
    });

    if (!monitorStatus) {
      return sendResponse(res, STATUS.NOT_FOUND, "No monitor found");
    }

    // get last checked
    const lastCheck = await lastChecked(monitorStatus.id);

    const resData = {
      status: monitorStatus.status,
      incidentCount: monitorStatus._count.Incident,
      lastChecked: lastCheck ? lastCheck.time : Date.now(),
    };

    return sendResponse(res, STATUS.SUCCESS, "Successfully fetched", resData);
  } catch (error) {
    return sendResponse(res, STATUS.INTERNAL_ERROR, "something went wrong");
  }
};

export const getMonitorIncidents = async (req: Request, res: Response) => {
  try {
    const { monitorId } = req.query;
    const { userId } = req.body;

    if (!monitorId || typeof monitorId !== "string") {
      return sendResponse(res, STATUS.INVALID_DATA, "Invalid monitor Id");
    }

    const incidents = await prisma.incident.findMany({
      where: {
        urlId: monitorId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return sendResponse(res, STATUS.SUCCESS, "successfully fetched", incidents);
  } catch (error) {
    return sendResponse(res, STATUS.INTERNAL_ERROR, "something went wrong");
  }
};

export const getMonitorStats = async (req: Request, res: Response) => {
  try {
    const { monitorId, days, region } = req.query;

    if (!monitorId || !days || !region) {
      return sendResponse(res, STATUS.INVALID_DATA, "Invalid stats data");
    }

    if (
      typeof monitorId !== "string" ||
      typeof region !== "string" ||
      typeof days !== "string"
    ) {
      sendResponse(res, STATUS.INVALID_DATA, "Invalid monitor Id");
      return;
    }

    
    //@ts-ignore
    const data = await getUrlStat({ urlId:monitorId, days, region });

    return sendResponse(res, STATUS.SUCCESS, "Successfully fetched", data);
  } catch (error) {
    logger.error("🚀 ~ getUrlstata ~ error:", error);
    return sendResponse(res, STATUS.INTERNAL_ERROR, "something went wrong");
  }
};

export const getAllIncidents = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    const monitorsWithIncidents = await prisma.monitor.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        url: true,
        Incident: true,
        monitorName: true,
      },
    });

    const finalIncidents = monitorsWithIncidents.reduce(
      (acc: any[], monitor) => {
        const incidentList = monitor.Incident.map((incident) => ({
          ...incident,
          monitorId: monitor.id,
          url: monitor.url,
          monitorName: monitor.monitorName,
        }));
        return acc.concat(incidentList);
      },
      []
    );

    return sendResponse(
      res,
      STATUS.SUCCESS,
      "successfully fetched",
      finalIncidents
    );
  } catch (error) {
    logger.error("🚀 ~ getAllIncidents ~ error:", error);
    return sendResponse(res, STATUS.INTERNAL_ERROR, "something went wrong");
  }
};

export const updateMonitor = async (req: Request, res: Response) => {
  try {
    const { userId, monitorName, checkInterval, url } = req.body;
    const { monitorId } = req.query;
    if (!monitorId) {
      return sendResponse(res, STATUS.INVALID_DATA, "Invalid monitor Id");
    }

    if (typeof monitorId !== "string") {
      return sendResponse(res, STATUS.INVALID_DATA, "Invalid monitor Id");
    }

    const updatedMonitor = await prisma.monitor.update({
      where: {
        id: monitorId,
      },
      data: {
        monitorName,
        checkInterval: Number(checkInterval),
      },
    });
    return sendResponse(
      res,
      STATUS.SUCCESS,
      "successfully fetched",
      updateMonitor
    );
  } catch (error) {
    return sendResponse(res, STATUS.SUCCESS, "something went wrong");
  }
};
