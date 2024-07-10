import React, { useEffect, useRef, useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator } from 'react-native';
import tailwind from 'tailwind-react-native-classnames';
import TimeAgo from 'react-native-timeago';
import { AuthContext } from '../Screens/AuthProvider';
import { collection, getFirestore,doc, setDoc,set, addDoc,orderBy, updateDoc, deleteDoc, getDoc, getDocs, where, query ,onSnapshot} from "firebase/firestore"; 


const Messages = ({ id, type }) => {
     const  { user }  = useContext(AuthContext); 
   /*   const user = useSelector(selectUser)  */
    const [messages, setMessage] = useState([])
    const [loading, setLoding] = useState(false)
    const msgRef = useRef(null)
    
    const checkIsSend = (phoneNumber) => phoneNumber === user.phoneNumber ? true : false;
const db = getFirestore();
    useEffect(() => {
        let isMounted = true;
        setLoding(true)
       
            /* const unsubscribe = query(collection(db, 'group', id , 'messages') , orderBy('time','asc')); */
            const unsubscribe =query(collection(db, 'group' , id , 'messages') , orderBy('timestamp', 'asc')); 
            onSnapshot(unsubscribe, (snapshot) => {
                const detas = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    timestamp: doc.data()?.timestamp?.toDate()?.getTime(),
                }))
                console.log(detas);
                if(isMounted){
                setMessage(detas)
    }

                setLoding(false)
            })
        

            return function cleanup() {
               isMounted = false;
               }
        
        
    }, []) 

    return (
        <View style={tailwind`flex-1 py-1 px-2`}>
            {loading && (
                <View style={tailwind`justify-center items-center py-4`}>
                    <ActivityIndicator size="small" color="#5B79E0" />
                </View>
            )}
            <ScrollView 
                style={tailwind`flex-1`} 
                ref={msgRef}
                onContentSizeChange={() => {        
                    msgRef?.current?.scrollToEnd({animated: true});
                }}
            >
                {messages?.map(chat => (
                    <View key={chat.id} style={tailwind`my-1 relative `}>
                    <View style={[tailwind`p-2 rounded-md`, { minWidth: 100, maxWidth: '80%', backgroundColor: checkIsSend(chat.number) ? '#E6FEDA' : '#fff', alignSelf: checkIsSend(chat.number) ? 'flex-end' : 'flex-start' }]}>
                            {(type === 'group' && !checkIsSend(chat.number)) && (
                                <Text style={[tailwind`font-bold text-xs text-blue-500`]}>{chat?.name}{/*  [{chat?.number}] */}</Text>
                                
                            )}
                            <Text style={[tailwind``, { fontSize: 16 }]}>{chat.message}</Text>
                            <Text style={[tailwind`self-end -mb-1 text-gray-500`, { fontSize: 10 }]}><TimeAgo time={chat.timestamp} /></Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({})

export default Messages;
