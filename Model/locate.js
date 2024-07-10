import { StyleSheet, Text, View,Alert,PermissionsAndroid,BackHandler} from 'react-native'
import React,{useContext,useEffect, useState}from 'react'
import { AuthContext } from '../Screens/AuthProvider';
import * as Location from "expo-location"
import { collection, getFirestore,doc, setDoc, addDoc, updateDoc, deleteDoc, getDoc, getDocs, where, query ,onSnapshot} from "firebase/firestore";
import * as TaskManager from "expo-task-manager";
import {useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
const LOCATION_TASK_NAME = "LOCATION_TASK_NAME"
let foregroundSubscription = null
import { selectChats, selectContacts, updateContacts,updateRecords , selectRecords , selectLists,selectName} from '../redux/slices/dataSlice'

// Define the background task for location tracking
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error(error)
    return
  }
  if (data) {
    // Extract location coordinates from data
    const { locations } = data
    const location = locations[0]
    if (location) {
      console.log("Location in background", location.coords)
    }
  }
})

const locate = () => {
    const  { user }  = useContext(AuthContext);
    const [position, setPosition] = useState(null)
    const [name, setName] = useState('')
    const Name = useSelector(selectName);




    const findUser = async () => {
        const result = await AsyncStorage.getItem('user1');
    
        
    
        console.log(result)
        setName(JSON.parse(result));
      };
    
   
      useEffect(() => {
        findUser();
      }, []);
    
    useEffect(() => {
        const requestPermissions = async () => {
          const foreground = await Location.requestForegroundPermissionsAsync()
          
        }
    
        requestPermissions()
        startForegroundUpdate();
  
      
  
  
  
        
  
      }, [])
    
      goToSettings = () => {
        BackHandler.exitApp();
      };

      // Start location tracking in foreground
       startForegroundUpdate = async () => {
        // Check if foreground permission is granted
        if (Platform.OS !== "web") {
          const { status } = await Location.requestForegroundPermissionsAsync();
          
          if (status !== "granted") {
            Alert.alert(
              "Insufficient permissions!",
              "Sorry, we need location permissions to make this work!",
              [
                {
                  text: 'Ok',
                  onPress: () => goToSettings(),
                  style: 'cancel',
                }
                
              ]
            );
            return;
          }
        }
        // Make sure that foreground location tracking is not running
        foregroundSubscription?.remove()
    
        // Start watching position in real-time
        foregroundSubscription = await Location.watchPositionAsync(
          {
            // For better logs, we set the accuracy to the most sensitive option
            accuracy: Location.Accuracy.BestForNavigation,
          },
          location => {
            setPosition(location.coords)
          }
        )
      }
    
      // Stop location tracking in foreground
       stopForegroundUpdate = () => {
        foregroundSubscription?.remove()
        setPosition(null)
      }
    
      



        useEffect(() => {
        const interval = setInterval(function() {
          // method to be executed;
       geoqueries();
      },4000);
        // thanks @Luca D'Amico
      
        return () => clearInterval(interval)
      }, [])
       
 
      geoqueries = async() =>{
        // Add the hash and the lat/lng to the document. We will use the hash
        // for queries and the lat/lng for distance comparisons.
             
            try{

                const db = getFirestore();
      
                const docRef = collection(db, 'location');
                
              await setDoc(doc(docRef, user.phoneNumber), {
                name : Name,
                lat: position?.latitude,
                lng: position?.longitude,
                number : user.phoneNumber,
              }).then(()=>{
              
              })
            }catch(err){
              console.log(err)
            }
          }


  return (
    <></>
  );
}

export default locate;

const styles = StyleSheet.create({})