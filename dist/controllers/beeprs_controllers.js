"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getAllBeepers = getAllBeepers;
exports.createBeeper = createBeeper;
exports.getBeepersById = getBeepersById;
exports.updateBeeperById = updateBeeperById;
exports.deleteBeepersById = deleteBeepersById;
exports.getBeepersByStatus = getBeepersByStatus;
const dal = __importStar(require("../dal"));
const external = __importStar(require("../services/externalFunc"));
const updateFumc = __importStar(require("../services/updateFunc"));
function getAllBeepers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const beepers = yield dal.getAllBeepers();
        if (!beepers) {
            res.status(404).send("sorry. we don't found beepers");
            return;
        }
        res.send(beepers);
    });
}
function createBeeper(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const beeper = {
            id: external.generateUUID(),
            name: "a",
            status: dal.Status.manufactured,
            crationDate: new Date(),
        };
        const answer = yield dal.createBeeper(beeper);
        if (!answer) {
            res.status(404).send("sorry. we don't created beeper");
            return;
        }
        res.status(201).send("created beeper successfully");
    });
}
function getBeepersById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.params.id;
        if (!userId) {
            res.status(400).send("bad request. missing id");
            return;
        }
        const beeper = yield dal.getBeepersById(req.params.id);
        if (!beeper) {
            res.status(404).send("sorry. we don't found beeper");
            return;
        }
        res.send(beeper);
    });
}
function updateBeeperById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //קבלת מספר מזהה
        const userId = req.params.id;
        if (!userId) {
            res.status(400).send("bad request. missing id");
            return;
        }
        //קבלת תוכן הבקשה
        const data = req.body;
        //שליפת הביפור המתאים
        const beeper = yield dal.getBeepersById(req.params.id);
        if (!beeper) {
            res.status(404).send("sorry. we don't found beeper");
            return;
        }
        //קריאה לפונקציה שתבצע עדכון
        const midelAnswer = yield updateFumc.changeStatus(beeper, data);
        //במידה וחזרה שגיאה להחזיר אותה למשתמש
        if (typeof midelAnswer === "string") {
            res.status(404).send(midelAnswer);
            return;
        }
        //ככל ולא חזרה שגיאה לשמור את העדכון בראטאבייס
        const answer = yield dal.updateBeeper(userId, midelAnswer);
        //עדכון המתמש בעניין השמירה
        if (!answer) {
            res.status(404).send("sorry. we don't updated beeper");
            return;
        }
        res.status(201).send("updated beeper successfully");
    });
}
function deleteBeepersById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.params.id;
        if (!userId) {
            res.status(400).send("bad request. missing id");
            return;
        }
        const answer = yield dal.deleteBeeper(userId);
        if (!answer) {
            res.status(400).send("sorry. we don't deleted beeper");
            return;
        }
        res.status(200).send("deleted beeper successfully");
    });
}
function getBeepersByStatus(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const status = req.params.status;
        if (!status) {
            res.status(400).send("bad request. missing status");
            return;
        }
        if (status !== "manufactured" && status !== "assembled" && status !== "shipped" && status !== "deployed" && status !== "detonated") {
            res.status(400).send("bad request. wrong status");
            return;
        }
        const beepers = (yield dal.getBeepersByStatus(dal.Status[status])) || [];
        if (!beepers) {
            res.status(404).send("sorry. we don't found beepers for this status");
            return;
        }
        if (beepers.length === 0) {
            res.status(404).send("sorry. we don't found beepers for this status");
            return;
        }
        res.send(beepers);
    });
}
