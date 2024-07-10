import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import Constants from 'expo-constants'
import tailwind from 'tailwind-react-native-classnames';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ScreenHeader = ({ title,  subtitle, image, chatHeader = false, onPress }) => {
    const navigation = useNavigation()

    return (
        <View >
            <View style={tailwind`bg-white py-3 px-3 flex-row items-center`}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="ios-arrow-back-outline" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onPress} style={tailwind`ml-4 flex-row items-center flex-1`}>
                    {!!image && (
                        <Image
                            source={{ uri: image }}
                            style={tailwind`w-10 h-10 rounded-full mr-3`}
                        />
                    )}
                    <View style={tailwind`flex-1`}>
                        <Text style={[tailwind`text-black font-bold`, { fontSize: 16 }]} numberOfLines={1}>{title}</Text>
                        {!!subtitle && <Text style={tailwind`text-black text-xs`} numberOfLines={1}>{subtitle}</Text>}
                        
                    </View>
                </TouchableOpacity>
                {chatHeader && (
                    <View style={tailwind`flex-row items-center`}>
                    
                        {/* <TouchableOpacity style={tailwind`px-2`}>
                            <Entypo name="location" size={26} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={tailwind`px-2`}>
                            <MaterialCommunityIcons name="phone" size={24} color="#5B79E0" />
                        </TouchableOpacity> */}
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: Constants.statusBarHeight,
    }
})

export default ScreenHeader;
