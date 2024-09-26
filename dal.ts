import * as jsonfile from 'jsonfile'

export enum Status {
    assembled,
    shipped,
    deployed,
    detonated,
    manufactured
}
export interface Beeper {
    id?: string,
    name: string,
    status: Status,
    crationDate: Date
    explosionDate: Date
    latitudePoint  : number
    longitudePoint : number
}



