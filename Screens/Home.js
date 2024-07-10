import React, { useEffect, useState,useContext } from 'react';
import {View, StyleSheet, StatusBar,Text ,TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tailwind from 'tailwind-react-native-classnames';
import { MaterialIcons } from '@expo/vector-icons';
/* import UsersStatus from '../components/UsersStatus'; */
import { collection, getFirestore,doc, setDoc, addDoc, updateDoc, deleteDoc, getDoc, getDocs, where, query ,onSnapshot} from "firebase/firestore"; 
import ChatLists from '../Screens/Drawer/index';
import { useDispatch, useSelector } from 'react-redux';
import { selectChats, selectContacts, updateContacts ,updateRecords , updateLocation, updateLists, selectRecords,updateNotify, updateName} from '../redux/slices/dataSlice'
import { AuthContext } from './AuthProvider';
import Loader from '../Components/Loader';
import Locate from '../Model/locate';
import HomeHeader from '../Model/HomeHeader';
import NotificationPermission from '../Model/NotificationPermission'
import NameScreen from './AddName';
import { set } from 'firebase/database';
const HomeScreen = ({ navigation }) => {
    const [tab, setTab] = useState('chats')
    const [name, setName] = useState('')
        const  { user }  = useContext(AuthContext);
        const [loading,setLoading] = useState(true)   
   /*    const user = useSelector(selectUser)   */
    
    const [loadingFetch, setLodingFetch] = useState(false)
    const [selected, setSelected] = useState(null)
    const dispatch = useDispatch()
    const [modal, setModal] = useState(false)

    


    useEffect(() => {
      
    }, []); 


   



    useEffect(() => {
      const controller = new AbortController();
      let isMounted = true;
     
      const db= getFirestore()
      const unsubscribe = query(collection(db, 'users') , where("number", "==", user.phoneNumber));
      /* const q = query(unsubscribe, where("number", "!=", user.phoneNumber)); */
      onSnapshot(unsubscribe, (snapshot) => {
          const datas = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
              }))
              
              if(datas.length<1){
                setModal(true)
              }
              setLoading(false);
          }) 
          return function cleanup() {
            isMounted = false;
           }
   
    }, []); 



  
    
    useEffect(() => {
      const controller = new AbortController();
      let isMounted = true;

      setSelected(null)
      setLodingFetch(true)
     
      const db= getFirestore()
      const unsubscribe = query(collection(db, 'users') , where("number", "!=", user.phoneNumber));
      /* const q = query(unsubscribe, where("number", "!=", user.phoneNumber)); */
      onSnapshot(unsubscribe, (snapshot) => {
          const datas = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
              }))
              if(isMounted ){
              dispatch(updateLists(datas))
              setLoading(false);
        }

                setLodingFetch(false)
      
          }) 
          return function cleanup() {
            isMounted = false;
           }
   
    }, [5000]); 



    useEffect(() => {
      const controller = new AbortController();
      let isMounted = true;

      setSelected(null)
      setLodingFetch(true)
     
      const db= getFirestore()
      const unsubscribe = query(collection(db, 'Token') , where("number", "!=", user.phoneNumber));
      /* const q = query(unsubscribe, where("number", "!=", user.phoneNumber)); */
      onSnapshot(unsubscribe, (snapshot) => {
          const datas = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
              }))
              if(isMounted ){
              dispatch(updateNotify(datas))
              setLoading(false);
        }

                setLodingFetch(false)
      
          }) 
          return function cleanup() {
            isMounted = false;
           }
   
    }, [5000]); 

 
    useEffect(() => {
      const controller = new AbortController();
      let isMounted = true;

      setSelected(null)
      setLodingFetch(true)
     
      const db= getFirestore()
      const unsubscribe = query(collection(db, 'users') , where("number", "==", user.phoneNumber));
      onSnapshot(unsubscribe, (snapshot) => {
          const datas = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
              
              }))
              if(isMounted ){
                console.log(datas[0].name)
              dispatch(updateName(datas[0].name))
              dispatch(updateLocation(datas[0].car))
              setLoading(false);
        }

                setLodingFetch(false)
      
          }) 
          return function cleanup() {
            isMounted = false;
           }
   
    }, [5000]); 
   
                      
     
                                                                                                                                                                                            
    return (
      
        <View style={styles.container}>
        {/*  <NameScreen modal={modal} setModal={setModal} phone={user.phoneNumber} /> */}
         <Locate /> 
        <HomeHeader setTab={setTab} active={tab} />
        <NotificationPermission />
       
            {tab === 'chats' && <ChatLists /> }
            
            { loading?
    (
      <Loader visible={loading} />)
     : (
      <View>
            <TouchableOpacity onPress={() => navigation.navigate('Explore')} style={tailwind`bg-blue-500 w-16 h-16 rounded-full items-center justify-center shadow absolute bottom-4 right-4 z-50`}>
                <MaterialIcons name="group" size={26} color="white" />
            </TouchableOpacity>
             <TouchableOpacity onPress={() => navigation.navigate('Notify')} style={tailwind`bg-blue-500 w-12 h-12 rounded-full items-center justify-center shadow absolute bottom-24 right-6 z-50`}>
                <MaterialIcons name="offline-share" size={26} color="white" />
            </TouchableOpacity> 
            </View>
            )
            
    }
    
        </View>

    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#fff'
  },})

export default HomeScreen;
