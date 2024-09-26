"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_managment_1 = __importDefault(require("./routes/routes_managment"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
(0, routes_managment_1.default)(app);
const port = 3000;
app.listen(port);
