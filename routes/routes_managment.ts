//ייבוא קובץ הניתובים
import beepersRouts from "./beepers_routs";
import { Application } from "express-serve-static-core";
//פונקציה שתיקרא בהזנה לפורט ותנתב את הבקשות לקובץ
async function routesInit  (app : Application) { 
    app.use("/api/beepers" , beepersRouts)
}
export default routesInit;

