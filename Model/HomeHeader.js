import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity ,Alert} from 'react-native';
import tailwind from 'tailwind-react-native-classnames';
import Constants from 'expo-constants'
import firebase from '../Components/firebaseConfig';
import { MaterialIcons } from '@expo/vector-icons';


const HomeHeader = ({ active, setTab }) => {


    
    const deleteLeaveChat = () => {
        // Delete 
       
        // Leave
        
            Alert.alert('Sign Out!', 'Are you sure you want to Sign Out from this App?', [
                { text: 'yes', onPress: () => leaveChat() },
                { text: 'no' }
            ])
        
    }
 

    


    const leaveChat = async () => {
        firebase.auth().signOut().then(() =>{
        })
    }



    return (
        <View style={[tailwind`bg-blue-500 shadow-md mb-1`]}>
            <View style={tailwind`bg-white py-4 px-3 flex-row justify-between  items-center `}>
                <Text style={tailwind`text-black font-bold text-xl ml-2`}>FindMe</Text>
                <TouchableOpacity onPress={deleteLeaveChat} style={tailwind`mr-2`}>
                    <MaterialIcons name="logout" size={24} color="#5B79E0" />
                </TouchableOpacity>
            </View>
            <View style={styles.lineStyle} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: Constants.statusBarHeight,
        
    }
})

export default HomeHeader;
