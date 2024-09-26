import * as dal from "../dal"
const locationPoints: number[] = []


export async function changeStatus(beeper: dal.Beeper, data: any):Promise<dal.Beeper|string>{
    switch (beeper.status) {
        case dal.Status.manufactured: 
            { beeper.status = dal.Status.assembled; break}
        case dal.Status.assembled:
            { beeper.status = dal.Status.shipped; break}
        case dal.Status.shipped: 
          
                { beeper.status = dal.Status.deployed};
            break}
        case dal.Status.deployed:
            { beeper.status = dal.Status.detonated; break}
        default: {break }
    }
}