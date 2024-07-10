import React, {useContext,useState,useEffect} from 'react';
import { StyleSheet, Text, View,StatusBar} from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer,DarkTheme } from '@react-navigation/native';
import { collection, getFirestore,doc, setDoc, addDoc, updateDoc, deleteDoc, getDoc, getDocs, where, query ,onSnapshot} from "firebase/firestore"; 
import NameScreen from './AddName';
import MainTabScreen from './MainTabScreen';
import { DrawerContent  } from './DrawerContent';

const Drawer = createDrawerNavigator();
import RootStack from './RootStackScreen';
import {
  getAuth,
  onAuthStateChanged,
  FacebookAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { navigationRef } from '../Components/RootNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logoutUser, selectUser } from '../redux/slices/authSlice'
import {AuthContext} from './AuthProvider';



const auth = getAuth()
 const Main = () => {

   const  { user }  = useContext(AuthContext);  
  const [isDarkTheme,setIsDarkTheme] = React.useState(false);
  const [authenticated, setAuthenticated] = useState(true);
  const [modal, setModal] = useState(false)
  /* const user = useSelector(selectUser) */
  const dispatch = useDispatch()
        
   useEffect(() => {
    const unlisten = onAuthStateChanged(auth, authUser => {
        if (authUser) {
            const user = {
                name: authUser.displayName,
                number: authUser.phoneNumber
            }
            dispatch(loginUser(user))
        }
        else {
            dispatch(logoutUser())
        }
    })
    
}, [])                
  

  
    
  

                      
  return (

  
    <NavigationContainer ref={navigationRef} independent={true}>
        <StatusBar  backgroundColor="#fff" barStyle="dark-content"/>
        <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
     
   { !!user? (
    
    
    <Drawer.Screen name="HomeDrawer" component={MainTabScreen} />
 
   
         
      
      ):(
        <Drawer.Screen name="RootStack" component={RootStack}/> 
    )}  
    
       
      
    
         
        </Drawer.Navigator>
        <View >
      <StatusBar
      barStyle="dark-content"
      backgroundColor="white"
      hidden={false}
      />
    </View>
    </NavigationContainer>
   
  );
  }

  export default Main;
  