import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import tailwind from 'tailwind-react-native-classnames';
import { collection, getFirestore,doc, setDoc, addDoc, updateDoc, deleteDoc, getDoc, getDocs, where, query ,onSnapshot} from "firebase/firestore";
import React, { useState, useEffect, useRef,useContext } from 'react';
import { Text, View, Button, Platform,TouchableOpacity,StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../Screens/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {selectName} from '../redux/slices/dataSlice';
import {useDispatch, useSelector } from 'react-redux';
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function NotificationPermission({navigation}) {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const  { user }  = useContext(AuthContext); 
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
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);


     
        // add the code to do what you need with the notification e.g. navigate to a specific screen
        
    });

   
      const interval = setInterval(function() {
        // method to be executed;
     geoqueries();
    },2000);
      // thanks @Luca D'Amico
    
     
    
    

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };

    
  }, []);



  
  
  

  

  geoqueries = async() =>{
        try{

            const db = getFirestore();
            const docRef = collection(db, 'Token');
          await setDoc(doc(docRef, user.phoneNumber), {
            name : Name,
            token: expoPushToken,
            number : user.phoneNumber,
          }).then(()=>{
          
          })
        }catch(err){
          console.log(err)
        }
      }









      // Can use this function below, OR use Expo's Push Notification Tool-> https://expo.dev/notifications
async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Get Ready to share ride',
    body:`${Name} is leaving the home send request to share ride.`,
    data: { someData: 'goes here' },
    
  };
 
  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}



  return (
    <></>
  );
}





registerForPushNotificationsAsync = async () => {

  let token;

  if (Device.isDevice) {
    if (Platform.OS !== "web") {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  }
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

const styles = StyleSheet.create({

    appButtonText: {
        fontSize: 20,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
      },
})