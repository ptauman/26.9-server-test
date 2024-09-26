import * as dal from "../dal"
const locationPoints: number[] = []


export async function changeStatus(beeper: dal.Beeper, data: any):Promise<dal.Beeper|string>{
    switch (beeper.status) {
        case dal.Status.manufactured: 
            { beeper.status = dal.Status.assembled; break}
        case dal.Status.assembled:
            { beeper.status = dal.Status.shipped; break}
        case dal.Status.shipped: 
            {
                if (!deployedVais(beeper, data)) 
                    { return "bad request. missing latitudePoint or longitudePoint or aut off range" }
                beeper = updatDeployed(beeper, data)
                break
            }
        default: {break }
    }
    return beeper
}

function deployedVais(beeper: dal.Beeper, data: any): boolean {
    if (!data.latitudePoint || !data.longitudePoint)
        {return false}
    if (data.latitudePoint <33 || data.latitudePoint > 35 || data.longitudePoint < 35 || data.longitudePoint > 36)
        {return false}
    return true
}

function updatDeployed(beeper: dal.Beeper, data: any): dal.Beeper {
    beeper.latitudePoint = data.latitudePoint
    beeper.longitudePoint = data.longitudePoint
    beeper.status = dal.Status.deployed
    //קריאה לפונקציית הטיימר
    timer10SForUpdateBeeperStatus(beeper)
    return beeper
}
async function timer10SForUpdateBeeperStatus(beeper: dal.Beeper) {
    try{
        setTimeout( () => { updateDetoneted(beeper) }, 10000)   
    }
    catch{
        return;
    }
}
async function updateDetoneted(beeper: dal.Beeper) {
    try{
        if(!beeper.id){return}
        const currentbeeper = await dal.getBeepersById(beeper.id)
        if(!currentbeeper){return}
        currentbeeper.status = dal.Status.detonated
        currentbeeper.explosionDate = new Date()
        dal.updateBeeper(beeper.id, currentbeeper)
    }
    catch{
        return;
    }    
}