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
//ייבוא השרתים, הדאל ופונקציות חיצוניות
const dal = __importStar(require("../dal"));
const external = __importStar(require("../services/externalFunc"));
const updateFumc = __importStar(require("../services/updateFunc"));
//קבלת כל הביפרים
function getAllBeepers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //הבאת הביפרים מהדאל
            const beepers = yield dal.getAllBeepers();
            //החזרת תשובה למשתמש כולל טיפול בשגיאה
            if (!beepers) {
                res.status(404).send("sorry. we don't found beepers");
                return;
            }
            res.send(beepers);
        }
        catch (error) {
            res.status(500).send("Something unexpected happened. contact maintenance");
        }
    });
}
//יצירת ביפר חדש
function createBeeper(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = req.body;
            if (!data) {
                res.status(400).send("bad request. missing data");
                return;
            }
            if (!data.name) {
                res.status(400).send("bad request. missing name");
                return;
            }
            //קביעת הערכים הבסיסיים של הביפר
            const beeper = {
                //ייבוא מספר גנרי מפונקציה חיצונית
                id: external.generateUUID(),
                name: data.name,
                status: dal.Status.manufactured,
                //קביעת זמן הייצור לרגע זה
                created_at: new Date(),
            };
            //תשובה למשתמש בהתאם למה שחזר מהדאל כולל טיפול בשגיאות
            const answer = yield dal.createBeeper(beeper);
            if (!answer) {
                res.status(500).send("sorry. we don't created beeper");
                return;
            }
            res.status(201).send("created beeper successfully");
        }
        catch (error) {
            res.status(500).send("Something unexpected happened. contact maintenance");
        }
    });
}
//קבלת ביפר מסויים
function getBeepersById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //בדיקת המספר המזהה מהבקשה
            const userId = req.params.id;
            if (!userId) {
                res.status(400).send("bad request. missing id");
                return;
            }
            //שליפת הביפר המתאים
            const beeper = yield dal.getBeepersById(req.params.id);
            if (!beeper) {
                res.status(404).send("sorry. we don't found beeper");
                return;
            }
            //החזרת תשובה למשתמש
            res.send(beeper);
        }
        catch (error) {
            res.status(500).send("Something unexpected happened. contact maintenance");
        }
    });
}
//עדכון הסטטוס
function updateBeeperById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
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
            if (typeof midelAnswer === "string") { //במידה ולא חזרה שגיאה אלא המשתמש דילג שלב
                if (midelAnswer === "You chose to speed up the elimination and bypass the timer") {
                    res.status(200).send(midelAnswer);
                    return;
                }
                res.status(400).send(midelAnswer);
                return;
            }
            //ככל ולא חזרה שגיאה לשמור את העדכון בראטאבייס
            const answer = yield dal.updateBeeper(userId, midelAnswer);
            //עדכון המשתמש בעניין השמירה
            if (!answer) {
                res.status(404).send("sorry. we don't updated beeper");
                return;
            }
            res.status(201).send("updated beeper successfully");
        }
        catch (error) {
            res.status(500).send("Something unexpected happened. contact maintenance");
        }
    });
}
//מחיקת ביפר
function deleteBeepersById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //קבלת מספר מזהה
            const userId = req.params.id;
            if (!userId) {
                res.status(400).send("bad request. missing id");
                return;
            }
            //קריאה לפונקציית המחיקה בדאל והעברת התשובה למשתמש
            const answer = yield dal.deleteBeeper(userId);
            if (!answer) {
                res.status(400).send("sorry. we don't deleted beeper");
                return;
            }
            res.status(200).send("deleted beeper successfully");
        }
        catch (error) {
            res.status(500).send("Something unexpected happened. contact maintenance");
        }
    });
}
//קבלת ביפרים לפי סטטוס
function getBeepersByStatus(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //בדיקת שהתקבל סטטוס
            const status = req.params.status;
            if (!status) {
                res.status(400).send("bad request. missing status");
                return;
            }
            const convertToStatus = external.convertToStatus(status);
            if (!convertToStatus) {
                res.status(400).send("bad request. wrong status");
                return;
            }
            //קבלת כלל הביפרים לפי סטטוס
            const beepers = (yield dal.getBeepersByStatus(convertToStatus)) || [];
            //בדיקה שאכן קיבלנו משהו תקין והודעה למשתמש
            if (!beepers) {
                res.status(404).send("sorry. we don't found beepers for this status");
                return;
            }
            if (beepers.length === 0) {
                res.status(404).send("sorry. we don't found beepers for this status");
                return;
            }
            res.send(beepers);
        }
        catch (error) {
            res.status(500).send("Something unexpected happened. contact maintenance");
        }
    });
}
