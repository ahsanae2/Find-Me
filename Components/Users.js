import firebase from './firebaseConfig';
import { getDatabase, ref, set } from "firebase/database";
export  const writeUserData =async  (Username, email, phone, userUID) => {
   
    
    try {
       const db = getDatabase();
       set(ref(db, 'users/' + userUID), {
    username: Username,
    email: email,
    phone: phone,
    uuid: userUID,
    time:firebase.firestore
    .Timestamp.now().toDate().toString()
  

          }).then((data)=>{
              console.log('data',data)
          }).catch((error) =>{
              console.log('error',error)
          })
    } catch (error) {
       alert(error);
    }

    
} 