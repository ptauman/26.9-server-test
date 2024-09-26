//מספר מזהה ייחודי
import { v4 as uuidv4 } from 'uuid';
export function generateUUID() {
    return uuidv4();
}
