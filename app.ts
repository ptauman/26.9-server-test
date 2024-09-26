import express, { Request, Response} from "express";
//ייבוא מנהל הניתובים
import routesInit from "./routes/routes_managment";
//יצירת מופע של אקספרס
const app = express();
//המרת הנתונים מג'ייסון לג'אווה סקריפט
app.use(express.json());
//הרצת מנהל הניתובים
routesInit(app)
//קביעת פורט והאזנה לו
const port : number = 3000;
app.listen(port)
