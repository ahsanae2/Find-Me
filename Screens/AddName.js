import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import React, { useState } from "react";
import tailwind from "tailwind-react-native-classnames";
import Icon from "react-native-vector-icons/Ionicons";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import * as RootNavigation from "../Components/RootNavigation";
import Loader from "../Components/Loader";
import { useNavigation } from "@react-navigation/core";
import { RadioButton } from "react-native-paper";

const NameScreen = ({ phone, modal, setModal }) => {
  const [name, setname] = useState("");
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = React.useState("Yes");

  const handleSubmit = async () => {
    const user1 = name;
    await AsyncStorage.setItem("user1", JSON.stringify(user1));
  };

  const write = async () => {};

  const Add = async () => {
    handleSubmit();
    if (!name) {
      alert("please add name");
      return;
    }
    if (name.length < 3) {
      alert("Min name length of 3", "name");
      return;
    }

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

  const handleSelect = (select) => {
    Alert.alert("Delete User!", "Are you sure you want to delete this User?", [
      { text: "yes", onPress: () => deleteChat() },
      { text: "no" },
    ]);
    const deleteChat = async () => {
      setLoading(true);
      const db = getFirestore();
      const chatRef = collection(db, "users");
      await deleteDoc(doc(chatRef, select.id))
        .then(() => {
          setLoading(false);
        })
        .catch((error) => {
          Alert.alert("Failed", error?.message);
        });
    };
  };

  return (
    <View>
      <Modal animationType="slide" transparent={true} visible={modal}>
        <Loader visible={loading} />
        <View style={styles.container}>
          <View
            style={tailwind`flex-row justify-between items-center px-4 pt-4`}
          >
            <Text style={tailwind`font-bold text-lg`}>Add new user name</Text>
            {/* <TouchableOpacity style={tailwind``} onPress={() => setModal(false)}>
                            <Ionicons name="close-circle-outline" size={30} color="#5B79E0" />
                        </TouchableOpacity> */}
          </View>
          <View style={{ marginTop: 50, paddingHorizontal: 30 }}>
            <Text
              style={[
                styles.text_footer,
                {
                  marginVertical: 10,
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
            <View style={{ marginTop: 10 }}>
              <Text
                style={[
                  styles.text_footer,
                  {
                    marginVertical: 10,
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
            <View style={styles.button}>
              <TouchableOpacity
                onPress={() => Add()}
                style={tailwind`bg-blue-500 w-32  h-12 rounded-lg items-center justify-center  absolute `}
              >
                <Icon
                  style={styles.appButtonText}
                  size={40}
                  backgroundColor="#5B79E0"
                  color="black"
                >
                  Submit
                </Icon>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default NameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  appButtonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 40,
  },
  text_footer: {
    color: "#333333",
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
  },
});
