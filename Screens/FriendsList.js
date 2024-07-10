import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, ImageBackground, Keyboard, ActivityIndicator,Text ,StyleSheet} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { selectName } from '../redux/slices/dataSlice';
import { getRecipientEmails } from './BottomBar/utils';
import tailwind from 'tailwind-react-native-classnames';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import Messages from '../Model/users';
import { useNavigation } from '@react-navigation/core';
import { updateChats } from '../redux/slices/dataSlice';
import { AuthContext } from './AuthProvider';
import { collection, getFirestore,doc, set,setDoc,orderBy, addDoc, updateDoc, deleteDoc, getDoc, getDocs, where, query ,onSnapshot} from "firebase/firestore"; 
import ScreenHeader from '../Model/ScreenHeader'
import EmojiSelector from 'react-native-emoji-selector';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../Components/firebaseConfig';





const ChatScreen = ({ route }) => {
    const { subject, image, type, users, id } = route?.params?.chat
   /*  const user = useSelector(selectUser) */
    const [message, setMessage] = useState('')
    const [lastSeen, setSetLastSeen] = useState(0)
    const [name, setName] = useState('')
    const [active, setActive] = useState(false)
    const [emojiAction, setEmojiAction] = useState(false)
    const navigation = useNavigation()
    const [loading, setLoding] = useState(false)
    const dispatch = useDispatch()
    const  { user }  =  React.useContext(AuthContext); 
    const Name = useSelector(selectName);
    const db = getFirestore();
     const singleRecipient = () => {
        const recipient = getRecipientEmails(users, user)[0]
        return recipient
    } 




    useEffect(() => {
        findUser();
      }, []);
  


    const findUser = async () => {
        const result = await AsyncStorage.getItem('user1');
    
    
        console.log(result)
        setName(JSON.parse(result))
        
      };

      const timestamp = firebase.firestore.FieldValue.serverTimestamp();

      var date = new Date();
      var current_date =date.getDate()+"-"+(date.getMonth()+1)+"-"+  date.getFullYear();
      var current_time = date.getHours()+":"+date.getMinutes()+":"+ date.getSeconds();
      var time =current_time+"  "+current_date;	

    const sendMessage = async () => {
        setEmojiAction(false)
        const chatRef = collection(db , 'group')
        setDoc(doc(chatRef, id), {
            lastMessage: `${type === 'group' ? `${Name}: ` : ''}${message.trim()}`,
            timestamp
        }, { merge: true }).then(()=>{
            console.log('Submitted!')
        }).catch((error) => {
                        
            alert(error);
           
            })


        const colRef = collection(db, 'group', id , "messages") 
         const addedDocument =  addDoc(colRef,{
            message: message.trim(),
            number : user.phoneNumber,
            timestamp,
           /*  firebase.firestore
           .Timestamp.now().toDate().toString()*/
           name : Name 
        }) 
        
        setMessage('')
    }


    const openEmoji = () => {
        Keyboard.dismiss();
        setEmojiAction(!emojiAction)
    }

    const onEmojiSelected = (e) => {
        setMessage(message + e)
    }

    useEffect(() => {
        if(type !== 'group') return;
        setLoding(true)
       

      
       let isMounted = true;
           
         const db= getFirestore();
        
        const unsubscribe = query(collection(db, 'group') , orderBy('timestamp' ,'desc'));
        onSnapshot(unsubscribe, (snapshot) => {
            const datas = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data()?.timestamp?.toDate()?.getTime(),
            }))
           console.log(datas)
            const chatForThisUser = datas.filter(x => x?.users?.map(x => x.number).includes(user.phoneNumber))
            console.log(chatForThisUser);
            if(isMounted ){
            dispatch(updateChats(chatForThisUser))
            }
            setLoding(false)
        })

        return function cleanup() {
            isMounted = false;
           }

    }, []) 

    return (
        <View style={styles.container}>
          <ScreenHeader
                title={type === 'single' ? singleRecipient().name : subject}
                subtitle={type == 'single' ? (active ? 'active' : 'offline') : `${users?.length} users`}
                
                chatHeader
                onPress={() => navigation.navigate('DetailsScreen', { chat: { ...route?.params?.chat } })}
            />
            {/*  <TouchableOpacity  onPress={() => navigation.navigate('DetailsScreen', { chat: { ...route?.params?.chat } })} style={tailwind`bg-blue-500 w-12 h-12 rounded-full items-center justify-center shadow absolute right-4 top-4 z-50`}>
                        <MaterialIcons name="info" size={22} color="white" />
                    </TouchableOpacity>  */}
                   
                {loading && (
                    <ActivityIndicator size="small" color="#5B79E0" />
                )}
                <Messages id={id} type={type} />

                
                <View style={tailwind`px-3 flex-row items-center my-2`}>
                    <View style={tailwind`flex-1 relative `}>
                        <TouchableOpacity onPress={openEmoji} style={tailwind`absolute left-3 z-20 items-center justify-center h-full`}>
                            <Entypo name="emoji-happy" size={25} color="#ddd" />
                        </TouchableOpacity>
                        <TextInput
                            placeholder="Message"
                            style={tailwind`px-3 h-12 bg-white rounded-full pl-11 relative z-10`}
                            onChangeText={setMessage}
                            value={message}
                            multiline
                            autoFocus={true}
                            onFocus={() => setEmojiAction(false)}
                        />
                    </View>
                    <TouchableOpacity disabled={!message} onPress={sendMessage} style={tailwind`ml-2 w-12 h-12 rounded-full bg-blue-500 items-center justify-center`}>
                        <MaterialIcons name="send" size={22} color="white" />
                    </TouchableOpacity>
                </View>
                 {emojiAction && (
                    <View style={tailwind`flex-1 bg-white`}>
                         <EmojiSelector
                            showSearchBar={false}
                            onEmojiSelected={onEmojiSelected}
                            columns={9}
                        /> 
                         
                    </View>
                )} 
             
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:'#e6e6e6'
    },})
  
export default ChatScreen;
