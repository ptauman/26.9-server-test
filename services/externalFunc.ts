//מספר מזהה ייחודי
import { v4 as uuidv4 } from 'uuid';
import * as dal from "../dal";
export function generateUUID() {
    return uuidv4();
}
export function convertToStatus(status : string) {
    switch(status){
        case "manufactured":
            return dal.Status.manufactured
        case "assembled":
            return dal.Status.assembled
        case "shipped":
            return dal.Status.shipped
        case "deployed":
            return dal.Status.deployed
        case "detonated":
            return dal.Status.detonated
        default:
            return null
    }
}

