import React, { useEffect, useState } from "react";
import SignInScreen from './SignInScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import NetInfo from "@react-native-community/netinfo";
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Dimensions,
    StyleSheet,
    StatusBar,
    Image,
    Button,
    ActivityIndicator,
    Description
} from 'react-native';
import tailwind from 'tailwind-react-native-classnames';
import * as Animatable from 'react-native-animatable';
import NativeLinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@react-navigation/native';
import Loader from '../Components/Loader';
import LottieView from 'lottie-react-native'
const SplashScreen = ({navigation}) => {
    const { colors } = useTheme();

    const [network, setNetwork] = useState('')
    const [loading, setLoading] = useState(false);



    useEffect(() => {
        unsubscribe()
      }, []);
    
      function unsubscribe() {
        NetInfo.fetch().then(state => {
          setNetwork(state)
          const interval = setInterval(function() {
          
           
            if (state.isConnected) {
              // any thing you want to load before navigate home screen
             <View><Text>connected</Text></View> 
              
            } else {
              setLoading(false)
              alert('No internet')
            }
        },3000);
        
        
          return () => clearInterval(interval)
         
        })
      };
      
    return (
      <View style={styles.container}>
      <Loader visible={loading} />
          <StatusBar  barStyle="dark-content" backgroundColor="white"/>
          <View style={styles.header}>
            <Animatable.Image 
                
            source={require('../assets/car-person.jpg')}
            style={styles.logo}
            resizeMode="stretch"
            />
            
            <Text style= {styles.container1}></Text>
        </View>
       
        <Animatable.View 
            style={styles.footer}
            animation="fadeInUpBig"
        >
            <Text style={[styles.title, {
                color: colors.text
            }]}>Welcome to the FindMe app</Text>
            <Text style={styles.text}>Sign in with account</Text>
            <View style={styles.button}>
            
            
            <TouchableOpacity  onPress={() => navigation.navigate('SignInScreen')}
               style={tailwind`bg-blue-500 w-32  h-12 rounded-lg items-center justify-center shadow absolute  right-3 `}
               >
           <Icon  style={styles.appButtonText}  size={40} backgroundColor="#5B79E0" color='black' 
               
               
              >Get Started</Icon>
     </TouchableOpacity>
      
            
            </View>
        </Animatable.View>
      </View>
    );
};

export default SplashScreen;

const {height} = Dimensions.get("screen");
const height_logo = height * 0.42;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#e6e6e6'
  },
  header: {
      flex: 2,
      justifyContent: 'center',
      alignItems: 'center'
  },
  footer: {
      flex: 1,
      backgroundColor: '#fff',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingVertical: 50,
      paddingHorizontal: 30
  },
  signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor:'#5B79E0'
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
  logo: {
      width: height_logo,
      height: height_logo,
      
  },
  title: {
      color: '#05375a',
      fontSize: 30,
      fontWeight: 'bold'
  },
  text: {
      color: 'grey',
      marginTop:5
  },
  button: {
      alignItems: 'flex-end',
      marginTop: 30,
      paddingVertical: 12,
  },
  signIn: {
      width: 150,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
      flexDirection: 'row'
  },
  textSign: {
      color: 'white',
      fontWeight: 'bold'
  },
  button1:{
    paddingVertical: 12,
      
  },
  container1:{
      fontSize:24,
      fontWeight: 'bold',
      color: '#5B79E0',
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#5B79E0",
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 12,
    
    
  },
  appButtonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    
  },
});