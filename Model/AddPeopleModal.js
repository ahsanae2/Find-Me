import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView, Image, Text, ActivityIndicator, Alert ,TextInput} from 'react-native';
import tailwind from 'tailwind-react-native-classnames';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectContacts, updateContacts , selectAdd, updateAdd } from '../redux/slices/dataSlice';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useNavigation } from '@react-navigation/core';
import { collection, getFirestore,doc, setDoc, addDoc, updateDoc, deleteDoc, getDoc, getDocs, where, query ,onSnapshot} from "firebase/firestore"; 
import { MaterialIcons } from '@expo/vector-icons';

const AddPeopleModal = ({ modal, setModal, users, user, id }) => {
    const contacts = useSelector(selectContacts)
    const add = useSelector(selectAdd)
    const [loading, setLoding] = useState(false)
    const [selected, setSelected] = useState([])
    const [loadingFetch, setLodingFetch] = useState(false)
    const [state, setState] = useState({});
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const db = getFirestore()
    const [Query, setQuery] = useState("")
    const handleSelect = select => {
        const index = selected?.findIndex(x => x.number === select.number)
        if (index >= 0) {
            setSelected(selected.filter(x => x.number !== select.number))
        }
        else {
            setSelected([select, ...selected])
        }
    }

    useEffect(() => {
        let isMounted = true;
        setLodingFetch(true)
       
        const unsubscribe =   collection(db, 'users');
        const q = query(unsubscribe, where("number", "!=", user.phoneNumber));
        onSnapshot(q, (snapshot) => {
            const datas = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                }))
                console.log(datas)
                const filtered = removeExistingContacts(datas)
                if (isMounted){
                dispatch(updateAdd(filtered))
        }
                setLodingFetch(false)
            }) 
           
            return function cleanup() {
             isMounted = false;
           }
    

    }, [])

    const removeExistingContacts = (datas) => {
        const userEmails = users.map(x => x.number)
        return datas.filter(x => !userEmails.includes(x.number))
    }
    var date = new Date();
      var current_date =date.getDate()+"-"+(date.getMonth()+1)+"-"+  date.getFullYear();
      var current_time = date.getHours()+":"+date.getMinutes()+":"+ date.getSeconds();
      var time =current_time+"  "+current_date;
    const addNewUser = async () => {
        setLoding(true)
        const chatRef =collection(db , 'group')

        let data = {
            users: [...users, ...selected],
            lastMessage: `${selected.length} new people added!`,
            time:  new Date().toLocaleString()
        }




        setDoc(doc(chatRef, id), data
        , { merge: true })
        setLoding(false)
        setModal(false)
        navigation.goBack()
            // .then(() => {
               
            // })
            // .catch((e) => {
            //     setLoding(false)
            //     Alert.alert("Failed to add users!", e?.message);
            // })
    }

    const lowerCaseSongSearch = Query.toLowerCase();


    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modal}
            >
                <View style={tailwind`flex-1 bg-white`}>
                    <View style={tailwind`flex-row justify-between items-center px-4 pt-4`}>
                        <Text style={tailwind`font-bold text-lg`}>Add new users</Text>
                        <TouchableOpacity style={tailwind``} onPress={() => setModal(false)}>
                            <Ionicons name="close-circle-outline" size={30} color="#5B79E0" />
                        </TouchableOpacity>
                    </View>
                    {loadingFetch && (
                        <View style={tailwind`justify-center items-center py-4`}>
                            <ActivityIndicator size="small" color="#5B79E0" />
                        </View>
                    )}
                    <View style={tailwind`py-3 px-4`}>
                    <TextInput
                        placeholder="Search"
                        style={tailwind`px-3 py-2 bg-white border-b border-gray-200 border-b-2 mt-3`}
                        onChangeText={(text)=>setQuery(text)}
                        value={Query}
                       
                    />
                    </View>
                    <ScrollView style={tailwind`flex-1 mt-3 ml-2`}>
                        {add?.filter((e)=>e.name.toLowerCase().includes(lowerCaseSongSearch)).map(item => (
                            <View key={item.number} style={tailwind` py-3 flex-row items-center`}>
                            <MaterialIcons name="person" size={34} color="#5B79E0" style={[tailwind` w-12 h-12 rounded-full`,{backgroundColor:'#e6e6e6',padding:7}]} />
                               {/*  <Image
                                    source={{ uri: item?.image }}
                                    style={tailwind`w-12 h-12 rounded-full`}
                                /> */}
                                <View style={tailwind`flex-1 pl-4 py-2`}>
                                    <Text style={[tailwind`text-black flex-1 font-bold`, { fontSize: 16 }]} numberOfLines={1}>{item?.name}</Text>
                                    <Text style={tailwind`text-gray-600 text-xs`} numberOfLines={1}>{item?.number}</Text>
                                </View>
                                <View>
                                    <BouncyCheckbox fillColor="#5B79E0" isChecked={false} onPress={() => handleSelect(item)} />
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                    {(!!selected.length) && (
                        <View style={tailwind`my-2 px-4`}>
                            <TouchableOpacity disabled={loading} onPress={addNewUser} style={tailwind`bg-blue-500 py-3 w-full items-center rounded-sm`}>
                                {loading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={tailwind`text-white font-bold`}>{`Add ${selected.length} new users`}</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({})

export default AddPeopleModal;
