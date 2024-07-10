import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Button,
} from "react-native";
import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectContacts,
  updateContacts,
  selectLists,
  updateAdd,
  selectNotify,
  selectName,
} from "../redux/slices/dataSlice";
import tailwind from "tailwind-react-native-classnames";
import NotificationPermission from "../Model/NotificationPermission";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { AuthContext } from "./AuthProvider";
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

const Notify = ({ navigation }) => {
  const [Query, setQuery] = useState("");
  const [selected, setSelected] = useState([]);
  const notify = useSelector(selectNotify);
  const dispatch = useDispatch();
  const lowerCaseSongSearch = Query.toLowerCase();
  const Name = useSelector(selectName);
  const [latB, setlatB] = useState(null);
  const [lngB, setlngB] = useState(null);
  const { user } = useContext(AuthContext);

  const handleSelect = (select) => {
    const index = selected?.findIndex((x) => x.number === select.number);
    if (index >= 0) {
      setSelected(selected.filter((x) => x.number !== select.number));
    } else {
      setSelected([select, ...selected]);
    }
  };

  Notifications.addNotificationResponseReceivedListener((response) => {
    /* Notifications.DEFAULT_ACTION_IDENTIFIER */
    var stringWithCommas = JSON.stringify(
      response.notification.request.content.data.someData
    );
    var data = JSON.parse(stringWithCommas);

    console.log(data);
    if (response.actionIdentifier === "no") {
      Notifications.dismissAllNotificationsAsync();
      Notifications.dismissNotificationAsync();
    } else if (response.actionIdentifier === "yes") {
      navigation.navigate("Request", { data: data });
      Notifications.dismissAllNotificationsAsync();
    } else {
      navigation.navigate("Home");
    }
  });

  Notifications.setNotificationCategoryAsync("welcome", [
    {
      buttonTitle: `Reject`,
      identifier: "no",
      options: {
        opensAppToForeground: false,
        isDestructive: true,
      },
    },
    {
      identifier: "yes",
      buttonTitle: "Accept",
      options: {
        opensAppToForeground: false,
      },
    },
  ])
    .then((_category) => {})
    .catch((error) =>
      console.warn("Could not have set notification category", error)
    );

  async function sendPushNotification() {
    if (selected.length < 1) {
      alert("please select atleast one member");
      return;
    }
    let tokenArray = [];

    selected.map((users) => {
      tokenArray.push({
        to: users.token,
        sound: "default",
        title: "Get Ready to share ride",
        body: `${Name} is leaving the home send request to share ride.`,
        data: { someData: `${user.phoneNumber}` },
        //  categoryId: 'welcome',
      });
    });

    /*  const  message = {
        
            to: selected[0].token,
            sound: 'default',
            title: 'Get Ready to share ride',
            body:`${Name} is leaving the home send request to share ride.`,
            data: { someData: 'goes here' },
          }; */

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tokenArray),
    });
    navigation.navigate("Home");
  }

  return (
    <View style={tailwind`flex-1 bg-white`}>
      <NotificationPermission />
      <View style={tailwind`py-3 px-4`}>
        <TextInput
          placeholder="Search"
          style={tailwind`px-3 py-2 bg-white border-b border-gray-200 border-b-2 mt-3`}
          onChangeText={(text) => setQuery(text)}
          value={Query}
        />
      </View>
      {notify?.map((user) => (
        <TouchableOpacity
          onPress={async () => {
            await sendPushNotification();
          }}
          style={tailwind`bg-blue-500 w-16 h-16 rounded-full items-center justify-center shadow absolute bottom-4 right-4 z-50`}
        >
          <Ionicons name="arrow-forward" size={24} color="white" />
        </TouchableOpacity>
      ))}
      <ScrollView style={tailwind`flex-1`}>
        {notify
          ?.filter((e) => e.name.toLowerCase().includes(lowerCaseSongSearch))
          .map((user) => (
            <View
              key={user.number}
              style={tailwind`px-3 py-3 flex-row items-center`}
            >
              <MaterialIcons
                name="person"
                size={34}
                color="#5B79E0"
                style={[
                  tailwind` w-12 h-12 rounded-full`,
                  { backgroundColor: "#e6e6e6", padding: 7 },
                ]}
              />
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
                <Text style={tailwind`text-gray-600 text-xs`} numberOfLines={1}>
                  {user?.number}
                </Text>
              </View>
              <View>
                <BouncyCheckbox
                  fillColor="#5B79E0"
                  isChecked={false}
                  onPress={() => handleSelect(user)}
                />
              </View>
            </View>
          ))}
      </ScrollView>
    </View>
  );
};

export default Notify;
const styles = StyleSheet.create({
  appButtonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
  },
});
