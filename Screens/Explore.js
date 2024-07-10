import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import tailwind from "tailwind-react-native-classnames";
import { Ionicons } from "@expo/vector-icons";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useNavigation } from "@react-navigation/core";
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
import Loader from "../Components/Loader";
import { MaterialIcons } from "@expo/vector-icons";
import {
  selectChats,
  selectContacts,
  updateContacts,
  updateRecords,
  selectRecords,
  selectLists,
  selectName,
} from "../redux/slices/dataSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "../Components/firebaseConfig";
const GroupCreateScreen = () => {
  const [loading, setLoading] = useState(false);
  const contacts = useSelector(selectContacts);
  const lists = useSelector(selectLists);
  /*  const user = useSelector(selectUser) */
  const [selected, setSelected] = useState([]);
  const [image, setImage] = useState(null);
  const [subject, setSubject] = useState("");
  const [name, setname] = useState("");
  const navigation = useNavigation();
  const { user } = React.useContext(AuthContext);
  const [loadingFetch, setLodingFetch] = useState(false);
  const [query, setquery] = useState("");
  const dispatch = useDispatch();
  const Name = useSelector(selectName);

  const handleSelect = (select) => {
    const index = selected?.findIndex((x) => x.number === select.number);
    if (index >= 0) {
      setSelected(selected.filter((x) => x.number !== select.number));
    } else {
      setSelected([select, ...selected]);
    }
  };

  useEffect(() => {
    findUser();
  }, []);

  const findUser = async () => {
    const result = await AsyncStorage.getItem("user1");

    console.log(result);
    setname(JSON.parse(result));
  };

  const timestamp = firebase.firestore.FieldValue.serverTimestamp();

  var date = new Date();
  var current_date =
    date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
  var current_time =
    date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  var time = current_time + " " + current_date;

  const createGroup = () => {
    if (!subject) {
      alert("please add group name");
      return;
    } else if (selected.length < 1) {
      alert("please select atleast one member");
      return;
    }

    setLoading(true);
    let tel = {
      number: user.phoneNumber,
      name: Name,
    };
    let data = {
      users: [tel, ...selected],
      lastMessage: "started new group",
      type: "group",
      timestamp,
      /* firebase.firestore
          .Timestamp.now().toDate().toString() */
      subject: subject,
    };
    const db = getFirestore();
    const docRef = collection(db, "group");

    addDoc(docRef, data)
      .then((docRef) => {
        data.id = docRef.id;
        setLoading(false);
        navigation.navigate("FriendsList", { chat: data });
      })
      .catch((e) => {
        alert("Failed get users!", e?.message);
        setLoading(false);
      });
  };

  const lowerCaseSongSearch = query.toLowerCase();

  return (
    <View style={tailwind`flex-1 bg-white relative`}>
      <Loader visible={loading} />

      <View style={tailwind`flex-1`}>
        <View style={tailwind`py-3 px-4`}>
          <TextInput
            placeholder="Search"
            style={tailwind`px-3 py-2 bg-white border-b border-gray-200 border-b-2 mt-3`}
            onChangeText={(text) => setquery(text)}
            value={query}
          />
          <TextInput
            placeholder="Type group subject here"
            style={tailwind`px-3 py-2 bg-white border-b border-gray-200 border-b-2 mt-3`}
            onChangeText={setSubject}
            value={subject}
          />
        </View>
        <ScrollView style={tailwind`flex-1`}>
          {lists
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
                  <Text
                    style={tailwind`text-gray-600 text-xs`}
                    numberOfLines={1}
                  >
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

      <TouchableOpacity
        onPress={() => createGroup()}
        style={tailwind`bg-blue-500 w-16 h-16 rounded-full items-center justify-center shadow absolute bottom-4 right-4 z-50`}
      >
        <Ionicons name="arrow-forward" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({});

export default GroupCreateScreen;
