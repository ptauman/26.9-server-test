"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = void 0;
var Status;
(function (Status) {
    Status[Status["assembled"] = 0] = "assembled";
    Status[Status["shipped"] = 1] = "shipped";
    Status[Status["deployed"] = 2] = "deployed";
    Status[Status["detonated"] = 3] = "detonated";
    Status[Status["manufactured"] = 4] = "manufactured";
})(Status || (exports.Status = Status = {}));
