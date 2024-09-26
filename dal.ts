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
    created_at?: Date
    detonated_at?: Date
    latitude? : number
    longitude? : number
}
//שליפת כל הביפרים
export async function getBeepersFromJson() {
    try{//נסיון קריאה מהקובץ
        const beepers = await jsonfile.readFile('./beepers.json')
        return beepers      
    }
    catch(err){
        return null
    }
}
//כתיבה לקובץ
export async function createBeepersJson(beepers: Beeper[]) {
    try{      //נסיון כתיבה לקובץ  
        await jsonfile.writeFile('./beepers.json', beepers)
        return true  
    }
    //עדכון הפוקנציות הקוראות במקרה של כשלון
    catch(err){
        return false
    }
}
//העברת כל הביפרים
export async function getAllBeepers() {
    //קריאה לפונקציית השליפה
    const beepers = await getBeepersFromJson()
    //החזרת התשובה
    if (!beepers) {return null}
    return beepers  
}
//שליפת ביפר לפי מזהה
export async function getBeepersById(id: string) {
    //קריאה לפונקציית השליפה
    const beepers : Beeper[] = await getBeepersFromJson()
    //בדיקה שאכן קיבלנו משהו
    if (!beepers) {return null}
    //סינון המערך. אני יודע שאפשר לדלג ישר לשלב הבא אבל אני פרנואיד
    const foundBeepers = beepers.filter(beeper => beeper.id === id)
    if (foundBeepers.length === 0) {return null}
    const beeper = foundBeepers[0]
    //החזרת התשובה
    if (!beeper) {return null}
    return beeper
}
//שליפת ביפרים לפי סטטוס
export async function getBeepersByStatus(status: Status) {
    //קבלת כל הביפרים
    const beepers : Beeper[] = await getBeepersFromJson()
    if (!beepers) {return null}
    //סינון הביפרים המתאימים
    const foundBeepers = beepers.filter(beeper => beeper.status === status)
    //החזרת תשובה למשתמש
    if (foundBeepers.length === 0) {return null}
    return foundBeepers
}
//יצירת ביפר חדש
export async function createBeeper(beeper : Beeper){
    //קריאה לפונקצייה ששולפת ביפרים
    let beepers : Beeper[] = await getBeepersFromJson()
    //במידה ועדיין אל נוצרה רשימה
    if (!beepers) 
        { //יצירת רשימה והעברתה לפונקצייתה כתביה לקובץ
            const newBeeprs:Beeper[] = []
            const newAnswer : boolean = await createBeepersJson(newBeeprs)
            //טיפול במקרי שגיאה
            if (!newAnswer) {return null}
            //שליפה של רשימת הביפרים
            beepers = await getBeepersFromJson()           
        }
        //הוספת הביפר לרשימה
    beepers.push(beeper)
    //קיראה לפונקציית הכתיסה לקובץ והחלפת הרשימה הקיימת
    const answer : boolean = await createBeepersJson(beepers)
    return answer
}
//עדכון ביפר
export async function updateBeeper(id: string, updateBeeper : Beeper) {
    //קריאה לפונקצייה ששולפת ביפרים
    const beepers : Beeper[] = await getBeepersFromJson()
    if (!beepers) {return null}
    //סינון המערך
    const indexOfBeeper : number = beepers.findIndex(beeper => beeper.id === id)
    if (indexOfBeeper === -1) {return null}
    //החלפת הביפרים
    beepers[indexOfBeeper] = updateBeeper
    //קריאה לפונקציית הכתיבה לקובץ
    const answer : boolean = await createBeepersJson(beepers)
    return answer
}
//מחיקת ביפר
export async function deleteBeeper(id: string) {
    //קריאה לפונקצייה ששולפת ביפרים
    const beepers : Beeper[] = await getBeepersFromJson()
    if (!beepers) {return null}
    const foundBeepers = beepers.filter(beeper => beeper.id === id)
    if (foundBeepers.length === 0) {return null}
    const beeper = foundBeepers[0]
    if (!beeper) {return null}
    //סינון המערך ממקום הביפר באיבר אחד
    beepers.splice(beepers.indexOf(beeper), 1)
    //קריאה לפונקציית הכתיבה לקובץ
    const answer : boolean = await createBeepersJson(beepers)
    return answer
}

    
