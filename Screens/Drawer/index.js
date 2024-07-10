import React, { useEffect, useState,useContext } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator,View, Text ,TouchableOpacity} from 'react-native';
import SingleChatItem from '../BottomBar/index'
import tailwind from 'tailwind-react-native-classnames';
import { useDispatch, useSelector } from 'react-redux';
import { selectChats, updateChats,updateGroups } from '../../redux/slices/dataSlice';
import { collection, getFirestore,doc, setDoc,orderBy, addDoc, updateDoc, deleteDoc, getDoc, getDocs, where, query ,onSnapshot} from "firebase/firestore"; 
import { AuthContext } from '../AuthProvider';
import Loader from '../../Components/Loader';
import { MaterialIcons } from '@expo/vector-icons';
const ChatLists = () => {
    const  { user }  = useContext(AuthContext); 
    const [loading, setLoding] = useState(false)
    const chats = useSelector(selectChats)
    const dispatch = useDispatch()
    

    useEffect(() => {
       
        let  isMounted = true;
          
        const db= getFirestore();
        
        const unsubscribe = query(collection(db, 'group') , orderBy('timestamp' , 'desc'));
        onSnapshot(unsubscribe, (snapshot) => {
            const datas = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data()?.timestamp?.toDate()?.getTime(),
              
            }))
           
           console.log(datas)

            const chatForThisUser = datas.filter(x => x?.users?.map(x => x.number).includes(user.phoneNumber))
            console.log(chatForThisUser);
            console.log(chatForThisUser.length);
            dispatch(updateGroups(chatForThisUser.length))
            if(isMounted ){
            dispatch(updateChats(chatForThisUser))
            
        }
            setLoding(false)
        })
         
        return() => {
            isMounted = false;
           }
    }, [])

    return (
        <ScrollView style={tailwind`flex-1 `} showsHorizontalScrollIndicator={false}>
         <Loader visible={loading} />
        <View style={styles.container}>
            {loading && (
                <View style={tailwind`justify-center items-center py-4`}>
                   
                </View>
            )}
            {(!(!!chats.length) && !loading) && (
                <View style={tailwind`mt-10 justify-center px-5 items-center`}>
                    <Text style={tailwind`text-center text-gray-500`}>You have no  group yet! click the group icon and find someone to make group! 👶</Text>
                </View>
            )}
            {chats?.map(item => (
                <SingleChatItem key={item.id} {...item} item={item} />
            ))}
            </View>
           
        </ScrollView>
    );
}

const styles = StyleSheet.create({ 
    container: {
    flex: 1,
    backgroundColor:'#fff'
  }})

export default ChatLists;
