import React from 'react'
import { createStackNavigator} from '@react-navigation/stack';
import SplashScreen from './SplashScreen';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import FriendsList from './FriendsList';
import NameScreen from './AddName';
import VerificationScreen from './VerificationScreen';
const RootStack = createStackNavigator();
const RootStackScreen = ({navigation}) => (
  
    <RootStack.Navigator >
        <RootStack.Screen name="SplashScreen" component={SplashScreen} options={{headerShown: false}}/>
        <RootStack.Screen name="SignInScreen" component={SignInScreen} options={{headerShown: false}}/>
        {/* <RootStack.Screen name="SignUpScreen" component={SignUpScreen} options={{headerShown: false}}/> */}
        <RootStack.Screen name="VerificationScreen" component={VerificationScreen} options={{headerShown: false}}/>
    </RootStack.Navigator>
    
  );

export default RootStackScreen;