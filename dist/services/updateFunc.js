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
exports.changeStatus = changeStatus;
//ייבוא הדאל
const dal = __importStar(require("../dal"));
//פונקצהי לשינוי סטטוס
function changeStatus(beeper, data) {
    return __awaiter(this, void 0, void 0, function* () {
        //תגובה בהתאם לסטטוס קיים
        switch (beeper.status) {
            case dal.Status.manufactured:
                {
                    beeper.status = dal.Status.assembled;
                    break;
                }
            case dal.Status.assembled:
                {
                    beeper.status = dal.Status.shipped;
                    break;
                }
            case dal.Status.shipped:
                { //במידה והסטטוס הוא "נשלח" נפנה לפונקציה שתבדוק האם אפשר להעביר לססטוס הבא 
                    if (!deployedVais(beeper, data)) {
                        return null;
                    }
                    //נקרא לפונקציה שתעביר לססטטוס "נפרס" 
                    beeper = updatDeployed(beeper, data);
                    break;
                }
            //בכל מקרה אחר כולל שני הסטטוסים האחרונים לא נעשה דבר 
            default: {
                break;
            }
        } //במידה והכל תקין נחזיר את הביפר העדכני
        return beeper;
    });
}
//פונקציה לבדיקת עדכון פריסה
function deployedVais(beeper, data) {
    //בדיקה שהמשתמש שלח מיקומים
    if (!data.latitudePoint || !data.longitudePoint) {
        return false;
    }
    //בדיקה שהמיקומים תקינים
    if (data.latitudePoint < 33 || data.latitudePoint > 35 || data.longitudePoint < 35 || data.longitudePoint > 36) {
        return false;
    }
    return true;
}
//פונקציה לביצוע פריסה
function updatDeployed(beeper, data) {
    //עדכון הנקודות המתאימות
    beeper.latitudePoint = data.latitudePoint;
    beeper.longitudePoint = data.longitudePoint;
    //עדכון הסטטוס
    beeper.status = dal.Status.deployed;
    //קריאה לפונקציית הטיימר שתיהיה אחראית להמשך התהליך
    timer10SForUpdateBeeperStatus(beeper);
    //החזרת הביפר העדכני
    return beeper;
}
//פונקציית הטיימר
function timer10SForUpdateBeeperStatus(beeper) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //המתנת 10 שניות וקריאה לפונקיית עדכון החיסול והעברת הביפר המתאים
            setTimeout(() => { updateDetoneted(beeper); }, 10000);
        }
        catch (_a) {
            return;
        }
    });
}
//פונקציית החיסול
function updateDetoneted(beeper) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //ככל שאכן יש מספר מזהה
            if (!beeper.id) {
                return;
            }
            const currentbeeper = yield dal.getBeepersById(beeper.id);
            //מציאת הביפר בדאטאבייס כדי למנוע שגיאות בתהליך - אני יודע שלכאורה זה מיותר אבל לא יועיל לא יזיק
            if (!currentbeeper) {
                return;
            }
            //עדכון הסטטוס וזמן החיסול
            currentbeeper.status = dal.Status.detonated;
            currentbeeper.explosionDate = new Date();
            //קריאה לפונקציית הדאטאבייס שתשמור את השינויים
            dal.updateBeeper(beeper.id, currentbeeper);
        }
        catch (_a) {
            return;
        }
    });
}
