import React, { useEffect, useReducer, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert,
} from "react-native";
import tailwind from "tailwind-react-native-classnames";
import { MaterialIcons } from "@expo/vector-icons";
import { AuthContext } from "./AuthProvider";
import AddPeopleModal from "../Model/AddPeopleModal";
import * as RootNavigation from "../Components/RootNavigation";
import {
  collection,
  getFirestore,
  doc,
  setDoc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  where,
  query,
  get,
} from "firebase/firestore";
import firebase from "../Components/firebaseConfig";
import { Entypo } from "@expo/vector-icons";
import Loader from "../Components/Loader";
const ChatDetailsScreen = ({ route, navigation }) => {
  const { subject, image, type, users, id } = route?.params?.chat;
  const { user } = React.useContext(AuthContext);
  const [lastSeen, setSetLastSeen] = useState(0);
  const [active, setActive] = useState(false);
  const [modal, setModal] = useState(false);

  const [loading, setLoading] = React.useState(false);

  useEffect(() => {}, []);

  const deleteLeaveChat = () => {
    // Delete

    // Leave

    Alert.alert(
      "Leave group!",
      "Are you sure you want to leave from this group?",
      [{ text: "yes", onPress: () => leaveChat() }, { text: "no" }]
    );
  };

  const deleteChat = async () => {
    const db = getFirestore();
    db.collection("chats")
      .doc(id)
      .delete()
      .then(() => {
        navigation.navigate("HomeScreen");
      })
      .catch((error) => {
        Alert.alert("Failed", error?.message);
      });
  };
  var date = new Date();
  var current_date =
    date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
  var current_time =
    date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  var time = current_time + "  " + current_date;
  const leaveChat = async () => {
    const db = getFirestore();
    const chatRef = collection(db, "group");

    let data = {
      users: users.filter((x) => x.number !== user.phoneNumber),
      lastMessage: `${user.phoneNumber} left the group!`,
      time: time,
    };
    setLoading(true);
    setDoc(doc(chatRef, id), data, { merge: true })
      .then(async () => {
        setLoading(false);
        RootNavigation.navigate("Home");
      })
      .catch((error) => {
        alert(error);
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <Loader visible={loading} />
      <View style={tailwind`relative`}>
        <View style={tailwind`absolute bottom-4 left-0 px-4`}>
          <Text style={tailwind`text-white font-bold text-2xl`}>
            {type === "single" ? singleRecipient().name : subject}
          </Text>
          <Text style={tailwind`text-white text-xs`}>
            {type == "single"
              ? active
                ? "active"
                : "offline"
              : `You & ${users?.length - 1} peoples`}
          </Text>
        </View>
      </View>
      <View style={tailwind`flex-1 `}>
        <View style={tailwind`flex-1 relative`}>
          {type === "group" && (
            <View style={tailwind`flex-1 px-4 py-3`}>
              <Text
                style={tailwind`text-blue-500 font-bold`}
              >{`${users?.length} participates`}</Text>
              <TouchableOpacity
                style={tailwind`absolute right-4 top-4`}
                onPress={() => setModal(true)}
              >
                <MaterialIcons name="group-add" size={26} color="#5B79E0" />
              </TouchableOpacity>
              <ScrollView style={tailwind`flex-1 mt-4`}>
                {users?.map((user) => (
                  <View
                    key={user.number}
                    style={tailwind`py-2 flex-row items-center `}
                  >
                    {/*  <Text>{JSON.stringify(users)}</Text> */}
                    <View style={tailwind`flex-1 pl-4 py-2`}>
                      <Text
                        style={[
                          tailwind`text-black flex-1 font-bold`,
                          { fontSize: 16 },
                        ]}
                        numberOfLines={1}
                      >
                        {user?.name}
                      </Text>
                      <Text
                        style={tailwind`text-gray-600 text-xs`}
                        numberOfLines={1}
                      >
                        {user?.number}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Location", {
              chat: { ...route?.params?.chat },
            })
          }
          style={tailwind`bg-blue-500 w-16 h-16 rounded-full items-center justify-center shadow absolute bottom-14 mb-2 right-3 z-50`}
        >
          <Entypo name="location" size={26} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={deleteLeaveChat}
          style={tailwind`border-t border-white bg-white px-4 flex-row items-center py-3 mt-4`}
        >
          {type == "single" ? (
            <MaterialIcons name="delete" size={24} color="#5B79E0" />
          ) : (
            <MaterialIcons name="logout" size={24} color="#5B79E0" />
          )}
          <Text style={tailwind`pl-3 text-lg text-blue-500`}>
            {type === "single" ? "Delete conversation" : "Leave group"}
          </Text>
        </TouchableOpacity>
      </View>
      <AddPeopleModal
        modal={modal}
        setModal={setModal}
        users={users}
        user={user}
        id={id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "#e6e6e6",
  },
});
export default ChatDetailsScreen;
