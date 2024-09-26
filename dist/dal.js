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
exports.Status = void 0;
exports.getBeepersFromJson = getBeepersFromJson;
exports.createBeepersJson = createBeepersJson;
exports.getAllBeepers = getAllBeepers;
exports.getBeepersById = getBeepersById;
exports.getBeepersByStatus = getBeepersByStatus;
exports.createBeeper = createBeeper;
exports.updateBeeper = updateBeeper;
exports.deleteBeeper = deleteBeeper;
const jsonfile = __importStar(require("jsonfile"));
var Status;
(function (Status) {
    Status[Status["manufactured"] = 0] = "manufactured";
    Status[Status["assembled"] = 1] = "assembled";
    Status[Status["shipped"] = 2] = "shipped";
    Status[Status["deployed"] = 3] = "deployed";
    Status[Status["detonated"] = 4] = "detonated";
})(Status || (exports.Status = Status = {}));
//שליפת כל הביפרים
function getBeepersFromJson() {
    return __awaiter(this, void 0, void 0, function* () {
        try { //נסיון קריאה מהקובץ
            const beepers = yield jsonfile.readFile('./beepers.json');
            return beepers;
        }
        catch (err) {
            return null;
        }
    });
}
//כתיבה לקובץ
function createBeepersJson(beepers) {
    return __awaiter(this, void 0, void 0, function* () {
        try { //נסיון כתיבה לקובץ  
            yield jsonfile.writeFile('./beepers.json', beepers);
            return true;
        }
        //עדכון הפוקנציות הקוראות במקרה של כשלון
        catch (err) {
            return false;
        }
    });
}
//העברת כל הביפרים
function getAllBeepers() {
    return __awaiter(this, void 0, void 0, function* () {
        //קריאה לפונקציית השליפה
        const beepers = yield getBeepersFromJson();
        //החזרת התשובה
        if (!beepers) {
            return null;
        }
        return beepers;
    });
}
//שליפת ביפר לפי מזהה
function getBeepersById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        //קריאה לפונקציית השליפה
        const beepers = yield getBeepersFromJson();
        //בדיקה שאכן קיבלנו משהו
        if (!beepers) {
            return null;
        }
        //סינון המערך. אני יודע שאפשר לדלג ישר לשלב הבא אבל אני פרנואיד
        const foundBeepers = beepers.filter(beeper => beeper.id === id);
        if (foundBeepers.length === 0) {
            return null;
        }
        const beeper = foundBeepers[0];
        //החזרת התשובה
        if (!beeper) {
            return null;
        }
        return beeper;
    });
}
//שליפת ביפרים לפי סטטוס
function getBeepersByStatus(status) {
    return __awaiter(this, void 0, void 0, function* () {
        //קבלת כל הביפרים
        const beepers = yield getBeepersFromJson();
        if (!beepers) {
            return null;
        }
        //סינון הביפרים המתאימים
        const foundBeepers = beepers.filter(beeper => beeper.status === status);
        //החזרת תשובה למשתמש
        if (foundBeepers.length === 0) {
            return null;
        }
        return foundBeepers;
    });
}
//יצירת ביפר חדש
function createBeeper(beeper) {
    return __awaiter(this, void 0, void 0, function* () {
        //קריאה לפונקצייה ששולפת ביפרים
        let beepers = yield getBeepersFromJson();
        //במידה ועדיין אל נוצרה רשימה
        if (!beepers) { //יצירת רשימה והעברתה לפונקצייתה כתביה לקובץ
            const newBeeprs = [];
            const newAnswer = yield createBeepersJson(newBeeprs);
            //טיפול במקרי שגיאה
            if (!newAnswer) {
                return null;
            }
            //שליפה של רשימת הביפרים
            beepers = yield getBeepersFromJson();
        }
        //הוספת הביפר לרשימה
        beepers.push(beeper);
        //קיראה לפונקציית הכתיסה לקובץ והחלפת הרשימה הקיימת
        const answer = yield createBeepersJson(beepers);
        return answer;
    });
}
//עדכון ביפר
function updateBeeper(id, updateBeeper) {
    return __awaiter(this, void 0, void 0, function* () {
        //קריאה לפונקצייה ששולפת ביפרים
        const beepers = yield getBeepersFromJson();
        if (!beepers) {
            return null;
        }
        //סינון המערך
        const indexOfBeeper = beepers.findIndex(beeper => beeper.id === id);
        if (indexOfBeeper === -1) {
            return null;
        }
        //החלפת הביפרים
        beepers[indexOfBeeper] = updateBeeper;
        //קריאה לפונקציית הכתיבה לקובץ
        const answer = yield createBeepersJson(beepers);
        return answer;
    });
}
//מחיקת ביפר
function deleteBeeper(id) {
    return __awaiter(this, void 0, void 0, function* () {
        //קריאה לפונקצייה ששולפת ביפרים
        const beepers = yield getBeepersFromJson();
        if (!beepers) {
            return null;
        }
        const foundBeepers = beepers.filter(beeper => beeper.id === id);
        if (foundBeepers.length === 0) {
            return null;
        }
        const beeper = foundBeepers[0];
        if (!beeper) {
            return null;
        }
        //סינון המערך ממקום הביפר באיבר אחד
        beepers.splice(beepers.indexOf(beeper), 1);
        //קריאה לפונקציית הכתיבה לקובץ
        const answer = yield createBeepersJson(beepers);
        return answer;
    });
}
