import React, { useRef, useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
} from "react-native";
import SignInScreen from "./SignInScreen";
import Icon from "react-native-vector-icons/Ionicons";
import { Constants } from "expo";

import * as Animatable from "react-native-animatable";
import NativeLinearGradient from "react-native-linear-gradient";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import Separator from "../Components/Separator";
import Loader from "../Components/Loader";
import Ionicons from "react-native-vector-icons/Ionicons";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { Dimensions } from "react-native";
import Clipboard from "@react-native-community/clipboard";
const { height, width } = Dimensions.get("window");
import firebase from "../Components/firebaseConfig";
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
  writeBatch,
} from "firebase/firestore";
import { AuthContext } from "./AuthProvider";
import {
  FirebaseRecaptcha,
  FirebaseRecaptchaVerifierModal,
} from "expo-firebase-recaptcha";
import { firebaseConfig } from "../Components/firebaseConfig";
const setHeight = (h) => (height / 100) * h;
const setWidth = (w) => (width / 100) * w;
import tailwind from "tailwind-react-native-classnames";

const VerificationScreen = ({ route, navigation }) => {
  const { phone, name, checked } = route?.params;
  const firstInput = useRef();
  const [loading, setLoading] = React.useState(false);
  const [code, setcode] = useState("");
  const secondInput = useRef();
  const thirdInput = useRef();
  const fourthInput = useRef();
  const [otp, setOtp] = useState();
  const { colors } = useTheme();
  const recaptchaverifier = useRef(null);
  const [verificationid, setverificationid] = useState("");

  const handleSubmit = async () => {
    const user1 = name;
    await AsyncStorage.setItem("user1", JSON.stringify(user1));
  };

  const Add = async () => {
    const db = getFirestore();

    const docRef = collection(db, "users");

    setLoading(true);
    await setDoc(doc(docRef, phone), {
      name: name,
      number: phone,
      time: new Date().toLocaleString(),
      car: checked,
      /*  firebase.firestore
  .Timestamp.now().toDate().toString() */
    }).then(() => {
      console.log("Submitted!");
      setModal(false);
    });
  };

  const verifyCode = () => {
    Add();
    if (!otp) {
      alert("Please Enter OTP");
      return;
    }
    setLoading(true);
    const credential = firebase.auth.PhoneAuthProvider.credential(
      verificationid,
      otp
    );
    console.log(verificationid);
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(() => {
        setOtp("");
        setLoading(false);

        navigation.navigate("HomeDrawer", { phone: phone });
      })
      .catch((error) => {
        alert(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    try {
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      let id = phoneProvider
        .verifyPhoneNumber(phone, recaptchaverifier.current)
        .then(setverificationid)
        .catch((error) => {
          alert(error);
        });
    } catch (err) {
      alert("something went wrong");
      setLoading(false);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Loader visible={loading} />

      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View
        style={tailwind`bg-white ml-4 mr-4 h-12 mt-2  justify-center  items-center rounded-lg `}
      >
        <Text style={tailwind`font-bold text-lg `}>Verify Otp</Text>
        {/* <Text>Distance left: </Text> */}
      </View>
      <View style={styles.header}>
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaverifier}
          firebaseConfig={firebaseConfig}
        />
      </View>

      <Animatable.View style={styles.footer} animation="fadeInUpBig">
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >
          OTP Verification
        </Text>
        <Text style={styles.text}>
          Enter the OTP number just sent you at: {phone}
        </Text>

        <View style={styles.otpContainer}>
          <OTPInputView
            style={{ width: "80%", height: 80 }}
            pinCount={6}
            selectionColor="#5B79E0"
            autoFocusOnLoad
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled={(code) => {
              setOtp(code);
              console.log(code);
            }}
          />
        </View>
        <TouchableOpacity
          onPress={() => verifyCode()}
          style={[
            styles.signIn,
            {
              borderColor: "#5B79E0",
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
            Verify
          </Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};

export default VerificationScreen;

const height_logo = height * 0.32;

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
    flex: 2.7,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
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
    height: height_logo * 1.4,
  },
  title: {
    color: "#05375a",
    fontSize: 30,
    fontWeight: "bold",
  },
  text: {
    color: "grey",
    marginTop: 5,
    marginBottom: 20,
  },
  button: {
    alignItems: "flex-end",
    marginTop: 30,
    paddingVertical: 12,
  },
  signIn1: {
    width: 150,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    flexDirection: "row",
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
  button1: {
    paddingVertical: 12,
  },
  container1: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5B79E0",
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
  container: {
    flex: 1,
    backgroundColor: "#e6e6e6",
  },
  header1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    paddingBottom: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,

    lineHeight: 20 * 1.4,
    width: setWidth(80),
    textAlign: "center",
  },

  content: {
    fontSize: 20,

    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  phoneNumberText: {
    fontSize: 18,

    lineHeight: 18 * 1.4,
    color: "#FBA83C",
  },
  otpContainer: {
    marginBottom: 20,
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
  },
  otpBox: {
    borderRadius: 5,
    borderColor: "#5B79E0",
    borderWidth: 0.6,
  },
  otpText: {
    fontSize: 25,
    color: "#5B79E0",
    padding: 0,
    textAlign: "center",
    paddingHorizontal: 70,
    paddingVertical: 10,
  },
  signinButton: {
    backgroundColor: "#5B79E0",
    borderRadius: 8,
    marginHorizontal: 20,
    height: setHeight(6),
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  signinButtonText: {
    fontSize: 18,
    lineHeight: 18 * 1.4,
    color: "#fff",
  },
  borderStyleBase: {
    width: 30,
    height: 45,
  },

  borderStyleHighLighted: {
    borderColor: "#03DAC6",
  },

  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
  },

  underlineStyleHighLighted: {
    borderColor: "#03DAC6",
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
  },
  underlineStyleBase: {
    width: 35,
    height: 40,
    borderWidth: 0,
    borderBottomWidth: 1,
    color: "#5B79E0",
    fontSize: 25,
  },
  underlineStyleHighLighted: {
    borderColor: "#5B79E0",
  },
  borderStyleHighLighted: {
    borderColor: "#5B79E0",
  },
});
