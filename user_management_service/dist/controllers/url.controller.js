"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMonitor = exports.getAllIncidents = exports.getMonitorStats = exports.getMonitorIncidents = exports.getMonitorStatus = exports.getMonitor = exports.getAllMonitors = void 0;
exports.registerMonitor = registerMonitor;
exports.updateMonitorStatus = updateMonitorStatus;
exports.createIncident = createIncident;
exports.updateIncident = updateIncident;
exports.getAllUrls = getAllUrls;
exports.getAllIncident = getAllIncident;
const response_1 = require("../utils/response");
const db_1 = require("../config/db");
const redis_1 = require("../config/redis");
const influx_1 = require("../config/influx");
function registerMonitor(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, url, monitorName, checkInterval } = req.body;
        try {
            // get domain
            const urlSplit = url.split("/");
            const domain = urlSplit[2];
            const monitor = yield db_1.prisma.monitor.create({
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
            const redis = yield redis_1.redisClient.zAdd("monitoring:urls", [
                { value: JSON.stringify(Object.assign({}, monitor)), score: nextCheckTime },
            ]);
            (0, response_1.sendResponse)(res, response_1.STATUS.SUCCESS, "Monitor registered successfully", monitor);
        }
        catch (error) {
            (0, response_1.sendResponse)(res, response_1.STATUS.INTERNAL_ERROR, "something went wrong while monitoring");
        }
    });
}
function updateMonitorStatus(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { urlId, status } = req.query;
            if (!urlId || !status) {
                return (0, response_1.sendResponse)(res, response_1.STATUS.NOT_ALLOWED, "Invalid Query");
            }
            const isExists = yield db_1.prisma.monitor.findUnique({
                where: {
                    id: urlId,
                },
            });
            if (!isExists) {
                return (0, response_1.sendResponse)(res, response_1.STATUS.NOT_FOUND, "Invalid url id");
            }
            const update = yield db_1.prisma.monitor.update({
                where: {
                    id: urlId,
                },
                data: {
                    status: status,
                },
            });
            return (0, response_1.sendResponse)(res, response_1.STATUS.SUCCESS, "successfully updated");
        }
        catch (error) {
            return (0, response_1.sendResponse)(res, response_1.STATUS.INTERNAL_ERROR, "something went wrong");
        }
    });
}
function createIncident(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { urlId, startTime } = req.body;
            if (!urlId || !startTime) {
                return (0, response_1.sendResponse)(res, response_1.STATUS.NOT_ALLOWED, "Invalid query");
            }
            const isExists = yield db_1.prisma.monitor.findUnique({
                where: {
                    id: urlId,
                },
            });
            if (!isExists) {
                return (0, response_1.sendResponse)(res, response_1.STATUS.NOT_FOUND, "Invalid url id");
            }
            const createIncident = yield db_1.prisma.incident.create({
                data: {
                    urlId: urlId,
                    startTime: new Date(startTime),
                },
            });
            return (0, response_1.sendResponse)(res, response_1.STATUS.CREATED, "Incident created", createIncident);
        }
        catch (error) {
            console.log("🚀 ~ createIncident ~ error:", error);
            return (0, response_1.sendResponse)(res, response_1.STATUS.INTERNAL_ERROR, "Something went wrong while creating incident");
        }
    });
}
function updateIncident(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { urlId, endTime } = req.body;
            if (!urlId || !endTime) {
                return (0, response_1.sendResponse)(res, response_1.STATUS.NOT_ALLOWED, "Invalid query");
            }
            const latestIncident = yield db_1.prisma.incident.findMany({
                where: {
                    urlId: urlId,
                },
                orderBy: { createdAt: "desc" },
                take: 1,
            });
            if (latestIncident.length <= 0) {
                return (0, response_1.sendResponse)(res, response_1.STATUS.NOT_FOUND, "no incidents found");
            }
            //@ts-ignore
            const duration = new Date(endTime) - new Date(latestIncident[0].startTime);
            const incident = yield db_1.prisma.incident.update({
                where: {
                    id: latestIncident[0].id,
                },
                data: {
                    //@ts-ignore
                    endTime: new Date(endTime),
                    duration: duration,
                },
            });
            return (0, response_1.sendResponse)(res, response_1.STATUS.SUCCESS, "Incident updated", incident);
        }
        catch (error) {
            return (0, response_1.sendResponse)(res, response_1.STATUS.INTERNAL_ERROR, "error while Incident updated");
        }
    });
}
function getAllUrls(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const urlsToBeChecked = yield db_1.prisma.monitor.findMany({
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
            return (0, response_1.sendResponse)(res, response_1.STATUS.SUCCESS, "Successfully fetched", urlsToBeChecked);
        }
        catch (error) {
            console.log("🚀 ~ getAllUrls ~ error:", error);
            return (0, response_1.sendResponse)(res, response_1.STATUS.INTERNAL_ERROR, "something went wrong");
        }
    });
}
function getAllIncident(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.body.userId;
            if (!userId) {
                return (0, response_1.sendResponse)(res, response_1.STATUS.NOT_ALLOWED, "User ID not found in cookies");
            }
            const monitor = yield db_1.prisma.monitor.findMany({
                where: {
                    userId: userId,
                },
            });
            if (!monitor) {
                return (0, response_1.sendResponse)(res, response_1.STATUS.NOT_ALLOWED, "Please create website to monitor");
            }
            return (0, response_1.sendResponse)(res, response_1.STATUS.SUCCESS, "successfully", monitor);
        }
        catch (error) {
            console.log("🚀 ~ getAllIncident ~ error:", error);
            return (0, response_1.sendResponse)(res, response_1.STATUS.INTERNAL_ERROR, "something went wrong");
        }
    });
}
const getAllMonitors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        const monitors = yield db_1.prisma.monitor.findMany({
            where: {
                userId,
            },
        });
        return (0, response_1.sendResponse)(res, response_1.STATUS.SUCCESS, "Successfully fetched", monitors);
    }
    catch (error) {
        return (0, response_1.sendResponse)(res, response_1.STATUS.INTERNAL_ERROR, "something went wrong");
    }
});
exports.getAllMonitors = getAllMonitors;
const getMonitor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { monitorId } = req.query;
        const { userId } = req.body;
        if (!monitorId || typeof monitorId !== "string") {
            return (0, response_1.sendResponse)(res, response_1.STATUS.INVALID_DATA, "Invalid monitor Id");
        }
        const monitor = yield db_1.prisma.monitor.findUnique({
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
            return (0, response_1.sendResponse)(res, response_1.STATUS.NOT_FOUND, "No monitor found");
        }
        const lastCheck = yield (0, influx_1.lastChecked)(monitor.id);
        console.log("🚀 ~ getMonitor ~ lastCheck:", lastCheck);
        const resData = {
            monitorDetails: monitor,
            status: monitor.status,
            incidentCount: monitor._count.Incident,
            lastChecked: lastCheck.created_at,
        };
        return (0, response_1.sendResponse)(res, response_1.STATUS.SUCCESS, "Successfully fetched", resData);
    }
    catch (error) {
        return (0, response_1.sendResponse)(res, response_1.STATUS.INTERNAL_ERROR, "something went wrong");
    }
});
exports.getMonitor = getMonitor;
const getMonitorStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { monitorId } = req.query;
        const { userId } = req.body;
        if (!monitorId || typeof monitorId !== "string") {
            return (0, response_1.sendResponse)(res, response_1.STATUS.INVALID_DATA, "Invalid monitor Id");
        }
        const monitorStatus = yield db_1.prisma.monitor.findUnique({
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
            return (0, response_1.sendResponse)(res, response_1.STATUS.NOT_FOUND, "No monitor found");
        }
        // get last checked
        const lastCheck = yield (0, influx_1.lastChecked)(monitorStatus.id);
        const resData = {
            status: monitorStatus.status,
            incidentCount: monitorStatus._count.Incident,
            lastChecked: lastCheck.created_at,
        };
        return (0, response_1.sendResponse)(res, response_1.STATUS.SUCCESS, "Successfully fetched", resData);
    }
    catch (error) {
        return (0, response_1.sendResponse)(res, response_1.STATUS.INTERNAL_ERROR, "something went wrong");
    }
});
exports.getMonitorStatus = getMonitorStatus;
const getMonitorIncidents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { monitorId } = req.query;
        const { userId } = req.body;
        if (!monitorId || typeof monitorId !== "string") {
            return (0, response_1.sendResponse)(res, response_1.STATUS.INVALID_DATA, "Invalid monitor Id");
        }
        const incidents = yield db_1.prisma.incident.findMany({
            where: {
                urlId: monitorId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return (0, response_1.sendResponse)(res, response_1.STATUS.SUCCESS, "successfully fetched", incidents);
    }
    catch (error) {
        return (0, response_1.sendResponse)(res, response_1.STATUS.INTERNAL_ERROR, "something went wrong");
    }
});
exports.getMonitorIncidents = getMonitorIncidents;
const getMonitorStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { monitorId } = req.query;
        if (!monitorId) {
            return (0, response_1.sendResponse)(res, response_1.STATUS.INVALID_DATA, "Invalid monitor Id");
        }
        if (typeof monitorId !== "string") {
            return (0, response_1.sendResponse)(res, response_1.STATUS.INVALID_DATA, "Invalid monitor Id");
        }
        const data = yield (0, influx_1.getUrlStat)(monitorId);
        return (0, response_1.sendResponse)(res, response_1.STATUS.SUCCESS, "Successfully fetched", data);
    }
    catch (error) {
        console.log("🚀 ~ getUrlstata ~ error:", error);
        return (0, response_1.sendResponse)(res, response_1.STATUS.INTERNAL_ERROR, "something went wrong");
    }
});
exports.getMonitorStats = getMonitorStats;
const getAllIncidents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        const monitorsWithIncidents = yield db_1.prisma.monitor.findMany({
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
        const finalIncidents = monitorsWithIncidents.reduce((acc, monitor) => {
            const incidentList = monitor.Incident.map((incident) => (Object.assign(Object.assign({}, incident), { monitorId: monitor.id, url: monitor.url, monitorName: monitor.monitorName })));
            return acc.concat(incidentList);
        }, []);
        return (0, response_1.sendResponse)(res, response_1.STATUS.SUCCESS, "successfully fetched", finalIncidents);
    }
    catch (error) {
        console.log("🚀 ~ getAllIncidents ~ error:", error);
        return (0, response_1.sendResponse)(res, response_1.STATUS.INTERNAL_ERROR, "something went wrong");
    }
});
exports.getAllIncidents = getAllIncidents;
const updateMonitor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, monitorName, checkInterval, url } = req.body;
        const { monitorId } = req.query;
        if (!monitorId) {
            return (0, response_1.sendResponse)(res, response_1.STATUS.INVALID_DATA, "Invalid monitor Id");
        }
        if (typeof monitorId !== "string") {
            return (0, response_1.sendResponse)(res, response_1.STATUS.INVALID_DATA, "Invalid monitor Id");
        }
        const updatedMonitor = yield db_1.prisma.monitor.update({
            where: {
                id: monitorId,
            },
            data: {
                monitorName,
                checkInterval: Number(checkInterval),
            },
        });
        return (0, response_1.sendResponse)(res, response_1.STATUS.SUCCESS, "successfully fetched", exports.updateMonitor);
    }
    catch (error) {
        return (0, response_1.sendResponse)(res, response_1.STATUS.SUCCESS, "something went wrong");
    }
});
exports.updateMonitor = updateMonitor;
