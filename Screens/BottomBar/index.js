import React from 'react';
import {View, TouchableOpacity, Image, Text} from 'react-native';
import { useSelector } from 'react-redux';
import tailwind from 'tailwind-react-native-classnames';
import { getRecipientEmails } from  './utils'
import { AuthContext } from '../AuthProvider';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import TimeAgo from 'react-native-timeago';
import {
    Avatar,
  } from 'react-native-paper';
const SingleChatItem = ({ subject, image, timestamp, lastMessage, type, users, item }) => {
    const  { user }  = React.useContext(AuthContext); 
    const navigation = useNavigation()

    const recipient = () => {
        const recipient = getRecipientEmails(users, user)[0]
        return recipient
    }

    return (
        <TouchableOpacity style={tailwind`px-3 py-3 flex-row items-center bg-white  pl-5 relative z-10 mb-1 mt-1 z-50 shadow-md`} onPress={() => navigation.navigate('FriendsList', { chat: item })}>
             
                <MaterialIcons name="group" size={34} color="#5B79E0" style={[tailwind` w-12 h-12 rounded-full`,{backgroundColor:'#e6e6e6',padding:7}]} />
            
            <View style={tailwind`flex-1 pl-4`}>
                <View style={tailwind`flex-row mb-1`}>
                    <Text style={[tailwind`text-black flex-1 font-bold pr-3 -mb-1`, { fontSize: 16 }]} numberOfLines={1}>{type === 'single' ? recipient().name : subject}</Text>
                    <Text style={tailwind`text-xs text-blue-600`}><TimeAgo time={timestamp} hideAgo={true} /></Text>
                </View>
                <Text style={tailwind`text-gray-600 w-5/6`} numberOfLines={1}>{lastMessage}</Text>
            </View>
            
        </TouchableOpacity>
    );
}

export default SingleChatItem;
