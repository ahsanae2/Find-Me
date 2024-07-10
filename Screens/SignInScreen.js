import React, { useState, useContext, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
  StyleSheet,
  StatusBar,
  Alert,
  Image,
} from "react-native";
import { ImageBackground } from "react-native";
import * as Animatable from "react-native-animatable";
import LinearGradient from "react-native-linear-gradient";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import Loader from "../Components/Loader";
import { useTheme } from "react-native-paper";

import tailwind from "tailwind-react-native-classnames";
import * as RootNavigation from "../Components/RootNavigation";
import firebase from "../Components/firebaseConfig";
import { AuthContext } from "./AuthProvider";
import PhoneInput from "react-native-phone-number-input";
import { Constants } from "expo";
import Users from "../Model/users";
import { firebaseConfig } from "../Components/firebaseConfig";
import { RadioButton } from "react-native-paper";
import {
  FirebaseRecaptcha,
  FirebaseRecaptchaVerifierModal,
} from "expo-firebase-recaptcha";

const SignInScreen = ({ navigation }) => {
  const phoneInput = useRef(null);
  const [initializing, setInitializing] = useState(true);
  const [Username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [phone, setphone] = useState("");
  const [password, setpassword] = useState("");
  const [showNext, setShowNext] = useState(false);
  const [code, setcode] = useState("");
  const [verificationid, setverificationid] = useState("");
  const recaptchaverifier = useRef(null);
  const [loading, setLoading] = React.useState(false);
  const [otp, setOtp] = useState();
  const [name, setname] = useState("");
  const [checked, setChecked] = React.useState("Yes");
  const [data, setData] = React.useState({
    username: "",
    password: "",
    check_textInputChange: false,
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
  });

  const { colors } = useTheme();

  const sendVerification = () => {
    if (!phone) {
      alert("Please Enter Phone");
      return;
    }
    if (!name) {
      alert("please add name");
      return;
    }
    if (name.length < 3) {
      alert("Min name length of 3", "name");
      return;
    }
    navigation.navigate("VerificationScreen", {
      phone: phone,
      name: name,
      checked: checked,
    });
  };

  const textInputChange = (val) => {
    if (val.trim().length >= 4) {
      setData({
        ...data,
        username: val,
        check_textInputChange: true,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        username: val,
        check_textInputChange: false,
        isValidUser: false,
      });
    }
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

  const handleValidUser = (val) => {
    if (val.trim().length >= 4) {
      setData({
        ...data,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        isValidUser: false,
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <Loader visible={loading} />
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaverifier}
        firebaseConfig={firebaseConfig}
      />
      <View
        style={tailwind`bg-white  h-12 mt-2 ml-4 mr-4 justify-center z-50 items-center rounded-lg `}
      >
        <Text style={tailwind`font-bold text-lg `}>Sign In</Text>
      </View>
      <View style={styles.header1}>
        {/* <Animatable.Image 
               
            source={require('../assets/loca.webp')}
            style={styles.logo}
            resizeMode="stretch"
            /> 
            <Text style= {styles.container1}>FindMe</Text> */}
      </View>

      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        {/*  <Text style={[styles.text_footer, {
                color: colors.text
            }]}>Email</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="user-o"
                    color={colors.text}
                    size={20}
                />
                <TextInput 
                    placeholder="Email"
                    placeholderTextColor="#666666"
                    style={[styles.textInput, {
                        color: colors.text
                    }]}
                    autoCapitalize="none"
                    value={email}
                    onChangeText={(text)=>setemail(text)}
                    
                />
                {data.check_textInputChange ? 
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                : null}
            </View>
            { data.isValidUser ? null : 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Username must be 4 characters long.</Text>
            </Animatable.View>
            }
            

            <Text style={[styles.text_footer, {
                color: colors.text,
                marginTop: 25
            }]}>Password</Text>
            <View style={styles.action}>
                <Feather 
                    name="lock"
                    color={colors.text}
                    size={20}
                />
                <TextInput 
                    placeholder="Your Password"
                    placeholderTextColor="#666666"
                    secureTextEntry={data.secureTextEntry ? true : false}
                    style={[styles.textInput, {
                        color: colors.text
                    }]}
                    autoCapitalize="none"
                    value={password}
                    onChangeText={(text)=>setpassword(text)}
                />


                <TouchableOpacity
                    onPress={updateSecureTextEntry}
                >
                    {data.secureTextEntry ? 
                    <Feather 
                        name="eye-off"
                        color="grey"
                        size={20}
                    />
                    :
                    <Feather 
                        name="eye"
                        color="grey"
                        size={20}
                    />
                    }
                </TouchableOpacity>
            </View>  */}

        <Text
          style={[
            styles.text_footer,
            {
              marginVertical: 8,
            },
          ]}
        >
          Name
        </Text>
        <View style={styles.action}>
          <FontAwesome name="user-o" size={20} />
          <TextInput
            placeholder="Your Name"
            placeholderTextColor="#666666"
            style={[styles.textInput, {}]}
            minLength={4}
            autoCapitalize="none"
            value={name}
            onChangeText={(text) => setname(text)}
          />
        </View>

        <Text
          style={[
            styles.text_footer,
            {
              marginTop: 25,
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

        <View style={{ marginTop: 10 }}>
          <Text
            style={[
              styles.text_footer,
              {
                marginVertical: 5,
              },
            ]}
          >
            Have a Car ?
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.text_footer, { marginTop: 2 }]}>Yes</Text>

            <RadioButton
              value="first"
              status={checked === "Yes" ? "checked" : "unchecked"}
              onPress={() => setChecked("Yes")}
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.text_footer, { marginTop: 2 }]}>No </Text>

            <RadioButton
              value="second"
              status={checked === "No" ? "checked" : "unchecked"}
              onPress={() => setChecked("No")}
            />
          </View>
        </View>
        {data.isValidPassword ? null : (
          <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>
              Password must be 8 characters long.
            </Text>
          </Animatable.View>
        )}

        <TouchableOpacity>
          <Text style={{ color: "#009387", marginTop: 8 }}></Text>
        </TouchableOpacity>
        <View style={styles.button}>
          <TouchableOpacity
            onPress={() => sendVerification()}
            style={[
              styles.signIn,
              {
                borderColor: "#5B79E0",
                borderWidth: 1,

                marginBottom: 20,
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
              Sign In
            </Text>
          </TouchableOpacity>

          {/* <View style={styles.otpBox}>
          <TextInput
            style={styles.otpText}
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            
           
              onChangeText={(text)=>setOtp(text)}
            
          />
        </View>  
 


                  <TouchableOpacity
                    onPress={confirmCode}
                    style={[styles.signIn, {
                        borderColor: '#5B79E0',
                        borderWidth: 1,
                        marginTop: 15
                    }]}
                >
                    <Text style={[styles.textSign, {
                        color: '#fff'
                    }]}>Verify</Text>
                </TouchableOpacity>  */}
          {/* <TouchableOpacity
                    onPress={() => navigation.navigate('SignUpScreen')}
                    style={[styles.signUp, {
                        borderColor: '#5B79E0',
                        borderWidth: 1,
                        marginTop: 15
                    }]}
                >
                    <Text style={[styles.textSign, {
                        color: '#5B79E0'
                    }]}>Sign Up</Text>
                </TouchableOpacity> */}
        </View>
      </Animatable.View>
    </View>
  );
};

export default SignInScreen;
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
    paddingBottom: 90,
  },
  footer: {
    flex: 3.5,
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
    color: "#333333",
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  otpBox: {
    borderRadius: 5,
    borderColor: "#5B79E0",
    borderWidth: 0.6,
    marginBottom: 10,
    marginTop: 5,
  },
  otpText: {
    fontSize: 25,
    color: "#5B79E0",
    padding: 0,
    textAlign: "center",
    paddingHorizontal: 70,
    paddingVertical: 10,
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
  phoneContainer: {
    width: "75%",
    height: 24,
    backgroundColor: "#fff",
  },
  textInput1: {
    paddingVertical: 0,
    backgroundColor: "#fff",
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    marginTop: 15,
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#5B79E0",
  },
  signUp: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
  container1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "120%",
  },
  container1: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5B79E0",
  },
  logo: {
    width: height_logo,
    height: height_logo,
  },
  header1: {
    flex: 1.5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    paddingBottom: 10,
  },
});
