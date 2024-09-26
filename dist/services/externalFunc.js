"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUUID = generateUUID;
//מספר מזהה ייחודי
const uuid_1 = require("uuid");
function generateUUID() {
    return (0, uuid_1.v4)();
}
