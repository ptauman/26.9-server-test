import { Request, Response } from "express";
import * as dal from "../dal"
export async function getAllBeepers(req : Request, res : Response) {
    const beepers = await dal.getAllBeepers()
    if (!beepers) {res.status(404).send("sorry. we don't found beepers"); return}
    res.send(beepers)
}
export async function createBeeper(req : Request, res : Response) {
    const beeper: dal.Beeper = {
        id: "1",
        name: "a",
        status: dal.Status.manufactured,
        crationDate: new Date(),   
    }
    const answer = await dal.createBeeper(beeper)
    if (!answer) {res.status(404).send("sorry. we don't created beeper"); return}
    res.status(201).send("created beeper successfully")
}
export async function getBeepersById(req : Request, res : Response) {
    const userId = req.params.id
    if (!userId) 
        {res.status(400).send("bad request. missing id"); return}
    const beeper = await dal.getBeepersById(req.params.id)
    if (!beeper) 
        {res.status(404).send("sorry. we don't found beeper"); return}
    res.send(beeper)  
}
export async function updateBeeperById(req : Request, res : Response) {
    const userId = req.params.id
    if (!userId) 
        {res.status(400).send("bad request. missing id"); return}
    const beeper = await dal.getBeepersById(req.params.id)
    if (!beeper) 
        {res.status(404).send("sorry. we don't found beeper"); return}
    switch (beeper.status) {
            case dal.Status.manufactured: 
                { beeper.status = dal.Status.assembled; break}
            case dal.Status.assembled:
                { beeper.status = dal.Status.shipped; break}
            case dal.Status.shipped: 
                { beeper.status = dal.Status.deployed; break}
            case dal.Status.deployed:
                { beeper.status = dal.Status.detonated; break}
            default: {break }
        }
    const answer = await dal.updateBeeper(userId, beeper)
    if (!answer) {res.status(404).send("sorry. we don't updated beeper"); return}
    res.status(201).send("updated beeper successfully")     
}
export async function deleteBeepersById(req : Request, res : Response) {
    const userId = req.params.id
    if (!userId) 
        {res.status(400).send("bad request. missing id"); return}
    const answer = await dal.deleteBeeper(userId)
    if (!answer) {res.status(400).send("sorry. we don't deleted beeper"); return}
    res.status(200).send("deleted beeper successfully")
    
}
export async function getBeepersByStatus(req : Request, res : Response) {
    const status : string = req.params.status
    if (!status) 
        {res.status(400).send("bad request. missing status"); return}
    if (status !== "manufactured" && status !== "assembled" && status !== "shipped" && status !== "deployed" && status !== "detonated")
        {res.status(400).send("bad request. wrong status"); return}
    const beepers : dal.Beeper[] = await dal.getBeepersByStatus(dal.Status[status])|| []
    if (!beepers) {res.status(404).send("sorry. we don't found beepers for this status"); return}
    res.send(beepers)
}