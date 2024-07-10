import { doc, setDoc } from "firebase/firestore"; 
import firebase from './firebaseConfig';
import { getDatabase, ref, set } from "firebase/database";

export  const write =async  () => {
// Add a new document in collection "users"
const db = getDatabase();
await setDoc(doc(firebase, "cities", "LA"), {
    name: "Los Angeles",
    state: "CA",
    country: "USA"
  });
  

}