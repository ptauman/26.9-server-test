import { Request, Response } from "express";
//ייבוא השרתים, הדאל ופונקציות חיצוניות
import * as dal from "../dal"
import * as external from "../services/externalFunc";
import * as updateFumc from "../services/updateFunc";
//קבלת כל הביפרים
export async function getAllBeepers(req : Request, res : Response) {
    try{
        //הבאת הביפרים מהדאל
        const beepers = await dal.getAllBeepers()
        //החזרת תשובה למשתמש כולל טיפול בשגיאה
        if (!beepers) {res.status(404).send("sorry. we don't found beepers"); return}
        res.send(beepers)
    }
    catch(error){
        res.status(500).send("Something unexpected happened. contact maintenance")
    }
}
//יצירת ביפר חדש
export async function createBeeper(req : Request, res : Response) {
    try{
        //קביעת הערכים הבסיסיים של הביפר
        const beeper: dal.Beeper = {
            //ייבוא מספר גנרי מפונקציה חיצונית
            id: external.generateUUID(),
            name: "a",
            status: dal.Status.manufactured,
            //קביעת זמן הייצור לרגע זה
            crationDate: new Date(),   
        }
        //תשובה למשתמש בהתאם למה שחזר מהדאל כולל טיפול בשגיאות
        const answer = await dal.createBeeper(beeper)
        if (!answer) {res.status(500).send("sorry. we don't created beeper"); return}
        res.status(201).send("created beeper successfully")
    }
    catch(error){
        res.status(500).send("Something unexpected happened. contact maintenance")
    }
}
//קבלת ביפר מסויים
export async function getBeepersById(req : Request, res : Response) {
    try{
        //בדיקת המספר המזהה מהבקשה
        const userId = req.params.id
        if (!userId) 
            {res.status(400).send("bad request. missing id"); return}
        //שליפת הביפר המתאים
        const beeper = await dal.getBeepersById(req.params.id)
        if (!beeper) 
            {res.status(404).send("sorry. we don't found beeper"); return}
        //החזרת תשובה למשתמש
        res.send(beeper)  
    }
    catch(error){
        res.status(500).send("Something unexpected happened. contact maintenance")
    }
}
//עדכון הסטטוס
export async function updateBeeperById(req : Request, res : Response) {
    try{
        //קבלת מספר מזהה
        const userId = req.params.id
        if (!userId) 
            {res.status(400).send("bad request. missing id"); return}
        //קבלת תוכן הבקשה
        const data = req.body
        //שליפת הביפור המתאים
        const beeper = await dal.getBeepersById(req.params.id)
        if (!beeper) 
            {res.status(404).send("sorry. we don't found beeper"); return}
        //קריאה לפונקציה שתבצע עדכון
        const midelAnswer = await updateFumc.changeStatus(beeper,data)
        //במידה וחזרה שגיאה להחזיר אותה למשתמש
        if (!midelAnswer) 
            {res.status(404).send("bad request. missing latitudePoint or longitudePoint or aut off range"); return}    
        //ככל ולא חזרה שגיאה לשמור את העדכון בראטאבייס
        const answer = await dal.updateBeeper(userId, midelAnswer)
        //עדכון המשתמש בעניין השמירה
        if (!answer) {res.status(404).send("sorry. we don't updated beeper"); return}
        res.status(201).send("updated beeper successfully") 
    }
    catch(error){
        res.status(500).send("Something unexpected happened. contact maintenance")
    }    
}
//מחיקת ביפר
export async function deleteBeepersById(req : Request, res : Response) {
    try{
        //קבלת מספר מזהה
        const userId = req.params.id
        if (!userId) 
            {res.status(400).send("bad request. missing id"); return}
        //קריאה לפונקציית המחיקה בדאל והעברת התשובה למשתמש
        const answer = await dal.deleteBeeper(userId)
        if (!answer) {res.status(400).send("sorry. we don't deleted beeper"); return}
        res.status(200).send("deleted beeper successfully")
    }
    catch(error){
        res.status(500).send("Something unexpected happened. contact maintenance")
    }
}
//קבלת ביפרים לפי סטטוס
export async function getBeepersByStatus(req : Request, res : Response) {
    try{
        //בדיקת שהתקבל סטטוס
        const status : string = req.params.status
        if (!status) 
            {res.status(400).send("bad request. missing status"); return}
        //בדיקה שהסטטוס תקין
        if (status !== "manufactured" && status !== "assembled" && status !== "shipped" && status !== "deployed" && status !== "detonated")
            {res.status(400).send("bad request. wrong status"); return}
        //קבלת כלל הביפרים לפי סטטוס
        const beepers : dal.Beeper[] = await dal.getBeepersByStatus(dal.Status[status])|| []
        //בדיקה שאכן קיבלנו משהו תקין והודעה למשתמש
        if (!beepers) 
            {res.status(404).send("sorry. we don't found beepers for this status"); return}
        if (beepers.length === 0) 
            {res.status(404).send("sorry. we don't found beepers for this status"); return}
        res.send(beepers)    
    }
    catch(error){
        res.status(500).send("Something unexpected happened. contact maintenance")
    }
}