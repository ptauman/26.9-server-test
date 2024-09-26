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
const dal = __importStar(require("../dal"));
const locationPoints = [];
function changeStatus(beeper, data) {
    return __awaiter(this, void 0, void 0, function* () {
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
                {
                    if (!deployedVais(beeper, data)) {
                        return "bad request. missing latitudePoint or longitudePoint or aut off range";
                    }
                    beeper = updatDeployed(beeper, data);
                    break;
                }
            default: {
                break;
            }
        }
        return beeper;
    });
}
function deployedVais(beeper, data) {
    if (!data.latitudePoint || !data.longitudePoint) {
        return false;
    }
    if (data.latitudePoint < 33 || data.latitudePoint > 35 || data.longitudePoint < 35 || data.longitudePoint > 36) {
        return false;
    }
    return true;
}
function updatDeployed(beeper, data) {
    beeper.latitudePoint = data.latitudePoint;
    beeper.longitudePoint = data.longitudePoint;
    beeper.status = dal.Status.deployed;
    //קריאה לפונקציית הטיימר
    timer10SForUpdateBeeperStatus(beeper);
    return beeper;
}
function timer10SForUpdateBeeperStatus(beeper) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            setTimeout(() => { updateDetoneted(beeper); }, 10000);
        }
        catch (_a) {
            return;
        }
    });
}
function updateDetoneted(beeper) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!beeper.id) {
                return;
            }
            const currentbeeper = yield dal.getBeepersById(beeper.id);
            if (!currentbeeper) {
                return;
            }
            currentbeeper.status = dal.Status.detonated;
            currentbeeper.explosionDate = new Date();
            dal.updateBeeper(beeper.id, currentbeeper);
        }
        catch (_a) {
            return;
        }
    });
}
