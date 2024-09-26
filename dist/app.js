"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//ייבוא מנהל הניתובים
const routes_managment_1 = __importDefault(require("./routes/routes_managment"));
//יצירת מופע של אקספרס
const app = (0, express_1.default)();
//המרת הנתונים מג'ייסון לג'אווה סקריפט
app.use(express_1.default.json());
//הרצת מנהל הניתובים
(0, routes_managment_1.default)(app);
//קביעת פורט והאזנה לו
const port = 3000;
app.listen(port);
