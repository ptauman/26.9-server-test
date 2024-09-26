import express, { Request, Response} from "express";
import routesInit from "./routes/routes_managment";
const app = express();
app.use(express.json());


routesInit(app)
const port : number = 3000;
app.listen(port)
