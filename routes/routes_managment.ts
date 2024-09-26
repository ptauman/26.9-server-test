import beepersRouts from "./beepers_routs";
import { Application } from "express-serve-static-core";

async function routesInit  (app : Application) { 
    app.use("/api/beepers" , beepersRouts)
}
export default routesInit;

