import exp from 'constants'
import * as jsonfile from 'jsonfile'

export enum Status {
    manufactured,
    assembled,
    shipped,
    deployed,
    detonated
}
export interface Beeper {
    id?: string,
    name: string,
    status?: Status,
    crationDate?: Date
    explosionDate?: Date
    latitudePoint? : number
    longitudePoint? : number
}

export async function getBeepersFromJson() {
    try{
        const beepers = await jsonfile.readFile('./beepers.json')
        return beepers      
    }
    catch(err){
        return null
    }
}
export async function createBeepersJson(beepers: Beeper[]) {
    try{        
        await jsonfile.writeFile('./beepers.json', beepers)
        return true  
    }
    catch(err){
        return false
    }
}
export async function getAllBeepers() {
    const beepers = await getBeepersFromJson()
    if (!beepers) {return null}
    return beepers  
}
export async function getBeepersById(id: string) {
    const beepers : Beeper[] = await getBeepersFromJson()
    if (!beepers) {return null}
    const foundBeepers = beepers.filter(beeper => beeper.id === id)
    if (foundBeepers.length === 0) {return null}
    const beeper = foundBeepers[0]
    if (!beeper) {return null}
    return beeper
}
export async function getBeepersByStatus(status: Status) {
    const beepers : Beeper[] = await getBeepersFromJson()
    if (!beepers) {return null}
    const foundBeepers = beepers.filter(beeper => beeper.status === status)
    if (foundBeepers.length === 0) {return null}
    return foundBeepers
}
export async function createBeeper(beeper : Beeper){
    let beepers : Beeper[] = await getBeepersFromJson()
    if (!beepers) 
        { 
            const newBeeprs:Beeper[] = []
            const newAnswer : boolean = await createBeepersJson(newBeeprs)
            if (!newAnswer) {return null}
            beepers = await getBeepersFromJson()           
        }
    beepers.push(beeper)
    const answer : boolean = await createBeepersJson(beepers)
    return answer
}
export async function updateBeeper(id: string, updateBeeper : Beeper) {
    const beepers : Beeper[] = await getBeepersFromJson()
    if (!beepers) {return null}
    const indexOfBeeper : number = beepers.findIndex(beeper => beeper.id === id)
    if (indexOfBeeper === -1) {return null}
    beepers[indexOfBeeper] = updateBeeper
    const answer : boolean = await createBeepersJson(beepers)
    return answer
}
export async function deleteBeeper(id: string) {
    const beepers : Beeper[] = await getBeepersFromJson()
    if (!beepers) {return null}
    const foundBeepers = beepers.filter(beeper => beeper.id === id)
    if (foundBeepers.length === 0) {return null}
    const beeper = foundBeepers[0]
    if (!beeper) {return null}
    beepers.splice(beepers.indexOf(beeper), 1)
    const answer : boolean = await createBeepersJson(beepers)
    return answer
}

    
