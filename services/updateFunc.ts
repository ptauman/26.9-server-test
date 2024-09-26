//ייבוא הדאל
import * as dal from "../dal"
//פונקצהי לשינוי סטטוס
export async function changeStatus(beeper: dal.Beeper, data: any): Promise<dal.Beeper | string> {
    //תגובה בהתאם לסטטוס קיים
    switch (beeper.status) {
        case dal.Status.manufactured: 
            { beeper.status = dal.Status.assembled; break}
        case dal.Status.assembled:
            { beeper.status = dal.Status.shipped; break}
        case dal.Status.shipped: 
            {//במידה והסטטוס הוא "נשלח" נפנה לפונקציה שתבדוק האם אפשר להעביר לססטוס הבא 
                if (!deployedVais(beeper, data)) 
                    { return "Location points located in Lebanon must be filled" }
                //נקרא לפונקציה שתעביר לססטטוס "נפרס" 
                beeper = updatDeployed(beeper, data)
                break
            }
            //במידה והמשתמש בחר לעקוף את הטיימר
        case dal.Status.deployed:         
            {
                updateDetoneted(beeper)
                return "You chose to speed up the elimination and bypass the timer"}
                //במידה והוא מנסה להעביר סטטוס אחרי שכבר הגענו לקצה
        case dal.Status.detonated:
                {return "Sorry but we have no control over hell"}
        default: {break }
    }//במידה והכל תקין נחזיר את הביפר העדכני
    return beeper
}
//פונקציה לבדיקת עדכון פריסה
function deployedVais(beeper: dal.Beeper, data: any): boolean {
    //בדיקה שהמשתמש שלח מיקומים
    if (!data.latitude || !data.longitude)
        {return false}
    //בדיקה שהמיקומים תקינים
    if (data.latitude <33 || data.latitude > 35 || data.longitude < 35 || data.longitude > 36)
        {return false}
    return true
}
//פונקציה לביצוע פריסה
function updatDeployed(beeper: dal.Beeper, data: any): dal.Beeper {
    //עדכון הנקודות המתאימות
    beeper.latitude = data.latitude
    beeper.longitude = data.longitude
    //עדכון הסטטוס
    beeper.status = dal.Status.deployed
    //קריאה לפונקציית הטיימר שתיהיה אחראית להמשך התהליך
    timer10SForUpdateBeeperStatus(beeper)
    //החזרת הביפר העדכני
    return beeper
}
//פונקציית הטיימר
async function timer10SForUpdateBeeperStatus(beeper: dal.Beeper) {
    try{
        //המתנת 10 שניות וקריאה לפונקיית עדכון החיסול והעברת הביפר המתאים
        setTimeout( () => { updateDetoneted(beeper) }, 10000)   
    }
    catch{
        return;
    }
}
//פונקציית החיסול
async function updateDetoneted(beeper: dal.Beeper) {
    try{
        //ככל שאכן יש מספר מזהה
        if(!beeper.id){return}
        const currentbeeper = await dal.getBeepersById(beeper.id)
        //מציאת הביפר בדאטאבייס כדי למנוע שגיאות בתהליך - אני יודע שלכאורה זה מיותר אבל לא יועיל לא יזיק
        if(!currentbeeper){return}
        //עדכון הסטטוס וזמן החיסול
        currentbeeper.status = dal.Status.detonated
        currentbeeper.detonated_at = new Date()
        //קריאה לפונקציית הדאטאבייס שתשמור את השינויים
        dal.updateBeeper(beeper.id, currentbeeper)
    }
    catch{
        return;
    }    
}