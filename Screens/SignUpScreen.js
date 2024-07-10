import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import Firestore from "firebase/firestore";
import firebase from "../Components/firebaseConfig";
import { SignUpUser } from "../Components/SignUp";
import PhoneInput from "react-native-phone-number-input";
import * as Animatable from "react-native-animatable";
import LinearGradient from "react-native-linear-gradient";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import "firebase/compat/firestore";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { Drawer, useTheme } from "react-native-paper";
import { writeUserData } from "../Components/Users";
import Users from "../Model/users";
import Spinner from "react-native-loading-spinner-overlay";
import TextInputComponent from "../Components/TextInputComponent";
import * as RootNavigation from "../Components/RootNavigation";
import NativeTVNavigationEventEmitter from "react-native/Libraries/Components/AppleTV/NativeTVNavigationEventEmitter";
import Loader from "../Components/Loader";
import { getDatabase, ref, set, get, child } from "firebase/database";
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
} from "firebase/firestore";
import { LogBox } from "react-native";

LogBox.ignoreLogs(["Setting a timer"]);
import auth from "@react-native-firebase/auth";
import { AuthContext } from "./AuthProvider";
const SignUpScreen = ({ route, navigation }) => {
  const [Username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [phone, setphone] = useState("");
  const [password, setpassword] = useState("");
  const [Isloading, setIsLoading] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const phoneInput = useRef(null);
  const [checked, setChecked] = React.useState("Yes");

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (Isloading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#5B79E0" />
      </View>
    );
  }

  const [data, setData] = React.useState({
    check_textInputChange: false,
    secureTextEntry: true,
    isValidPassword: true,
  });

  const { colors } = useTheme();

  write = async (userUID) => {
    const db = getFirestore();

    const docRef = collection(db, "users");

    await setDoc(doc(docRef, userUID), {
      Username: Username,
      email: email,
      phone: phone,
      uuid: userUID,
      time: firebase.firestore.Timestamp.now().toDate().toString(),
    }).then(() => {
      console.log("Submitted!");
    });
    /* getDocs(docRef).then((snapshot)  =>  {
    let users = []
        snapshot.docs.forEach((doc) =>{

            users.push({ ...doc.data(),id:doc.id })
        })
        console.log(users)
}).catch(err => {
    console.log(err.message)

 }) */
  };

  const handlePasswordChange = (val) => {
    if (val.trim().length >= 8) {
      setData({
        ...data,
        password: val,
        isValidPassword: true,
      });
    } else {
      setData({
        ...data,
        password: val,
        isValidPassword: false,
      });
    }
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  Signupforfirebase = async () => {
    if (!Username || !email || !phone || !password) {
      alert("please add all the field");
      return;
    } else if (!email.match(/\S+@\S+\.\S+/)) {
      alert("Please input a valid email");
    }

    if (password.length < 6) {
      alert("Min password length of 6", "password");
    }
    try {
      setLoading(true);

      SignUpUser(email, password)
        .then((res) => {
          console.log("res", res);
          var userUID = firebase.auth().currentUser.uid;
          write(userUID);
          writeUserData(Username, email, phone, userUID)
            .then(async () => {
              alert("Registered Successfully");
              setLoading(false);
              RootNavigation.navigate("SignInScreen", { userid: "" });
            })
            .catch((error) => {
              alert(error);
              setLoading(false);
            });
          console.log(userUID);
        })
        .catch((error) => {
          alert(error);
          setLoading(false);
        });
    } catch (err) {
      alert("something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="lightblue" barStyle="light-content" />
      <Loader visible={loading} />

      <View style={styles.header1}>
        <Animatable.Image
          source={require("../assets/loca.webp")}
          style={styles.logo}
          resizeMode="stretch"
        />
        <Text style={styles.container1}>FindMe</Text>
      </View>

      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        <Text
          style={[
            styles.text_footer,
            {
              color: colors.text,
            },
          ]}
        >
          Username
        </Text>
        <View style={styles.action}>
          <FontAwesome name="user-o" color={colors.text} size={20} />
          <TextInput
            placeholder="Your Name"
            placeholderTextColor="#666666"
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
            minLength={4}
            autoCapitalize="none"
            value={Username}
            onChangeText={(text) => setusername(text)}
          />

          {data.check_textInputChange1 ? (
            <Animatable.View animation="bounceIn">
              <Feather name="check-circle" color="green" size={20} />
            </Animatable.View>
          ) : null}
        </View>

        <Text
          style={[
            styles.text_footer,
            {
              marginTop: 20,
              color: colors.text,
            },
          ]}
        >
          Email
        </Text>
        <View style={styles.action}>
          <FontAwesome name="user-o" color={colors.text} size={20} />
          <TextInput
            placeholder="Your Email"
            placeholderTextColor="#666666"
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => setemail(text)}
          />
        </View>

        <Text
          style={[
            styles.text_footer,
            {
              marginTop: 20,
              color: colors.text,
            },
          ]}
        >
          Phone
        </Text>
        <View style={styles.action}>
          <Feather name="phone" color={colors.text} size={20} />
          <PhoneInput
            ref={phoneInput}
            defaultValue={phone}
            defaultCode="PK"
            layout="first"
            placeholder="3000000000"
            containerStyle={styles.phoneContainer}
            textContainerStyle={styles.textInput1}
            onChangeFormattedText={(text) => {
              setphone(text);
            }}
          />
        </View>

        <Text
          style={[
            styles.text_footer,
            {
              color: colors.text,
              marginTop: 20,
            },
          ]}
        >
          Password
        </Text>
        <View style={styles.action}>
          <Feather name="lock" color={colors.text} size={20} />
          <TextInput
            placeholder="Your Password"
            placeholderTextColor="#666666"
            secureTextEntry={data.secureTextEntry ? true : false}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
            autoCapitalize="none"
            value={password}
            onChangeText={(text) => setpassword(text)}
          />
          <TouchableOpacity onPress={updateSecureTextEntry}>
            {data.secureTextEntry ? (
              <Feather name="eye-off" color="grey" size={20} />
            ) : (
              <Feather name="eye" color="grey" size={20} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.button}>
          <TouchableOpacity
            onPress={() => {
              this.Signupforfirebase();
            }}
            style={[
              styles.signIn,
              {
                borderColor: "#009387",
                borderWidth: 1,
                marginTop: 15,
              },
            ]}
          >
            <Text
              style={[
                styles.textSign,
                {
                  color: "#fff",
                },
              ]}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
};

export default SignUpScreen;
const { height } = Dimensions.get("screen");
const height_logo = height * 0.12;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6e6e6",
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  footer: {
    flex: 3,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    marginTop: 50,
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#5B79E0",
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
  logo: {
    width: height_logo,
    height: height_logo,
  },
  header1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    paddingBottom: 20,
  },
  container1: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5B79E0",
  },
  phoneContainer: {
    width: "75%",
    height: 24,
    backgroundColor: "#fff",
  },
  textInput1: {
    paddingVertical: 0,
    backgroundColor: "#fff",
  },
  loader: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});
