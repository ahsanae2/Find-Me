import React, { useContext, useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Ionicons";
import { View } from "react-native-animatable";
import Home from "./Home";
import Settings from "./Settings";
import Explore from "./Explore";
import Profile from "./Profile";
import FriendsList from "./FriendsList";
import Location from "./Location";
import NameScreen from "./AddName";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme, Avatar } from "react-native-paper";
import EditProfileScreen from "./EditProfileScreen";
import { AuthContext } from "./AuthProvider";
import firebase from "../Components/firebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, logoutUser, selectUser } from "../redux/slices/authSlice";
import DetailsScreen from "./DetailsScreen";
import {
  collection,
  getFirestore,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  where,
  query,
  onSnapshot,
} from "firebase/firestore";
import Notify from "./Notify";
import Request from "./Request";
import {
  getAuth,
  onAuthStateChanged,
  FacebookAuthProvider,
  signInWithCredential,
} from "firebase/auth";

const Tab = createMaterialBottomTabNavigator();

const HomeStack = createStackNavigator();
const SettingStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const ExploreStack = createStackNavigator();
const NameStack = createStackNavigator();
const LocationStack = createStackNavigator();
const auth = getAuth();

const MainTabScreen = () => (
  <Tab.Navigator
    initialRouteName="Home"
    activeColor="white"
    barStyle={{ backgroundColor: "#5B79E0" }}
  >
    <Tab.Screen
      name="Feed"
      component={HomeStackScreen}
      options={{
        tabBarLabel: "Home",
        tabBarIcon: ({ color }) => (
          <Icon name="ios-home" color={color} size={26} />
        ),
      }}
    />

    <Tab.Screen
      name="Settings"
      component={SettingStackScreen}
      options={{
        tabBarLabel: "Notify",
        tabBarIcon: ({ color }) => (
          <Icon name="ios-notifications" color={color} size={26} />
        ),
      }}
    />

    <Tab.Screen
      name="Profil"
      component={ProfileStackScreen}
      options={{
        tabBarLabel: "Profile",
        tabBarIcon: ({ color }) => (
          <Icon name="ios-person" color={color} size={26} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default MainTabScreen;

const HomeStackScreen = ({ navigation }) => {
  const { colors } = useTheme();

  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const unlisten = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        const user = {
          email: authUser.email,
        };
        dispatch(loginUser(user));
      } else {
        dispatch(logoutUser());
      }
    });
  }, []);

  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#fff",
        },
        headerTintColor: "black",
        headerTitleStyle: {
          color: "black",
        },
      }}
    >
      <HomeStack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          title: "FindMe",

          headerLeft: () => (
            <View style={{ marginLeft: 10 }}>
              <Icon.Button
                name="menu-outline"
                size={25}
                backgroundColor="#fff"
                color="black"
                onPress={() => navigation.openDrawer()}
              />
            </View>
          ),
        }}
      />
      <HomeStack.Screen
        name="Explore"
        options={{
          title: "Select",
        }}
        component={Explore}
      />
      <HomeStack.Screen
        name="FriendsList"
        options={{ headerShown: false }}
        component={FriendsList}
      />
      <HomeStack.Screen
        name="DetailsScreen"
        options={{
          title: "Details",
        }}
        component={DetailsScreen}
      />

      <HomeStack.Screen
        name="Notify"
        options={{
          title: "Notify",
        }}
        component={Notify}
      />
      <HomeStack.Screen
        name="Location"
        options={{
          title: "Location",
        }}
        component={Location}
      />
      <HomeStack.Screen
        name="Requests"
        options={{
          title: "Location",
        }}
        component={Request}
      />
    </HomeStack.Navigator>
  );
};

const SettingStackScreen = ({ navigation }) => (
  <SettingStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: "#fff",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        color: "black",
      },
    }}
  >
    <SettingStack.Screen
      name="Notify"
      component={Settings}
      // options={{
      // headerLeft:() => (
      // <View style={{marginLeft: 10}}>
      //  <Icon.Button name="menu-outline" size={25} backgroundColor="#fff" color='black' onPress={() =>
      //    navigation.openDrawer()
      // }
      //</View>   ></Icon.Button>
      // </View>
      //  )
      // }}
    />
  </SettingStack.Navigator>
);

const ProfileStackScreen = ({ navigation }) => {
  const { colors } = useTheme();

  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#fff",
          shadowColor: colors.background, // iOS
        },
        headerTintColor: colors.text,
      }}
    >
      <ProfileStack.Screen
        name="Profile"
        component={Profile}
        options={{
          title: "Profile",
          //       headerLeft:() => (
          //         <View style={{marginLeft: 10}}>
          //           <Icon.Button
          //             name="menu-outline"
          //             size={25}
          //             backgroundColor={colors.background}
          //             color={colors.text}
          //             onPress={() => navigation.openDrawer()}
          //          />
          //         </View>
          //       )
          //      headerRight:() => (
          //        <View style={{marginRight: 10}}>
          //          <MaterialCommunityIcons.Button
          //            name="account-edit"
          //            size={25}
          //            backgroundColor= '#fff'
          //            color={colors.text}
          //            onPress={() => navigation.navigate('EditProfile')}
          //          />
          //        </View>
          //      ),
        }}
      />
      {/* <ProfileStack.Screen
        name="EditProfile"
        options={{
          title: 'Edit Profile',
        }}
        component={EditProfileScreen}
      /> */}
    </ProfileStack.Navigator>
  );
};

const ExploreStackScreen = ({ navigation }) => (
  <ExploreStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: "#fff",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
        color: "black",
      },
    }}
  >
    <ExploreStack.Screen
      name="Explore"
      component={Explore}
      options={{
        headerLeft: () => (
          <View style={{ marginLeft: 10 }}>
            <Icon.Button
              name="menu-outline"
              size={25}
              backgroundColor="#fff"
              color="black"
              onPress={() => navigation.openDrawer()}
            ></Icon.Button>
          </View>
        ),
      }}
    />
  </ExploreStack.Navigator>
);
