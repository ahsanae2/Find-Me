import React, { useContext, useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
} from "react-native-paper";
import {
  collection,
  getFirestore,
  doc,
  deleteDoc,
  getDoc,
  getDocs,
  where,
  query,
} from "firebase/firestore";
import tailwind from "tailwind-react-native-classnames";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getDatabase, ref, get } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import files from "../assets/filesBase64";
import { AuthContext } from "./AuthProvider";
import firebase from "../Components/firebaseConfig";
import { selectGroups, selectName } from "../redux/slices/dataSlice";
import { useDispatch, useSelector } from "react-redux";
import ImagePicker from "../Components/form/ImagePicker";
import Loader from "../Components/Loader";
import * as RootNavigation from "../Components/RootNavigation";

const ProfileScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const groups = useSelector(selectGroups);
  const Name = useSelector(selectName);
  const [onLoadText, setText] = useState(null);
  const [username, setUsername] = useState(null);
  const [Phone, setPhone] = useState(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  let values = [];

  const findUser = async () => {
    const result = await AsyncStorage.getItem("user1");

    console.log(result);
    setName(JSON.parse(result));
  };

  useEffect(() => {
    findUser();
  }, []);

  const myCustomShare = async () => {
    const shareOptions = {
      message: ".",
      url: files.appLogo,
      // urls: [files.image1, files.image2]
    };

    try {
      const ShareResponse = await Share.open(shareOptions);
      console.log(JSON.stringify(ShareResponse));
    } catch (error) {
      console.log("Error => ", error);
    }
  };

  const deleteLeaveChat = () => {
    // Delete

    // Leave

    Alert.alert(
      "Sign Out!",
      "Are you sure you want to Sign Out from this App?",
      [{ text: "yes", onPress: () => leaveChat() }, { text: "no" }]
    );
  };

  const leaveChat = async () => {
    firebase
      .auth()
      .signOut()
      .then(() => {});
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete User!",
      "Are you sure you want to delete Your Account?",
      [{ text: "yes", onPress: () => deleteChat() }, { text: "no" }]
    );
    const deleteChat = async () => {
      setLoading(true);
      const db = getFirestore();
      const chatRef = collection(db, "users");
      await deleteDoc(doc(chatRef, user.phoneNumber))
        .then(() => {
          setLoading(false);
          firebase
            .auth()
            .signOut()
            .then(() => {});
        })
        .catch((error) => {
          Alert.alert("Failed", error?.message);
        });
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <Loader visible={loading} />
      <View style={styles.userInfoSection}>
        <View
          style={{
            marginTop: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Avatar.Image source={require("../assets/avatars.png")} size={80} />
          {/* <ImagePicker imageChange={setImage} /> */}
          <View>
            <Title
              style={[
                styles.title,
                {
                  marginTop: 10,
                },
              ]}
            >
              {Name}
            </Title>
          </View>
        </View>
      </View>

      <View style={styles.userInfoSection}>
        <View style={styles.row}>
          <Icon color="#000" size={20} />
          <Text style={{ color: "#5B79E0", marginLeft: 22 }}></Text>
        </View>
        <View style={styles.row}>
          <Icon name="phone-outline" color="#5B79E0" size={20} />
          <Text style={{ color: "#000", marginLeft: 20, fontSize: 18 }}>
            {user.phoneNumber}
          </Text>
        </View>
        <View style={styles.row}>
          <Icon color="#5B79E0" size={20} />
          <Text
            style={{ color: "#777777", marginLeft: 20, fontSize: 18 }}
          ></Text>
        </View>
        <View style={styles.row}>
          <Icon name="account-group-outline" color="#5B79E0" size={22} />

          <Text style={{ color: "#000", marginLeft: 20, fontSize: 18 }}>
            Groups: {groups}
          </Text>
        </View>
      </View>

      <View style={styles.infoBoxWrapper}>
        <View style={styles.menuWrapper}>
          <TouchableRipple onPress={() => navigation.navigate("Settings")}>
            <View style={styles.menuItem}>
              <Icon name="heart-outline" color="#5B79E0" size={25} />
              <Text style={styles.menuItemText}>Notify</Text>
            </View>
          </TouchableRipple>
        </View>
      </View>

      <View style={[tailwind`py-5 px-7 flex-row justify-between items-center`]}>
        <TouchableOpacity
          onPress={deleteLeaveChat}
          style={tailwind`bg-blue-500 w-32  h-12 rounded-lg items-center justify-center   `}
        >
          <Icon
            style={styles.appButtonText}
            size={40}
            backgroundColor="#5B79E0"
            color="black"
          >
            Exit
          </Icon>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleDelete()}
          style={tailwind`bg-blue-500 w-32  h-12 rounded-lg items-center justify-center `}
        >
          <Icon
            style={styles.appButtonText}
            size={40}
            backgroundColor="#5B79E0"
            color="black"
          >
            Delete
          </Icon>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6e6e6",
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
  },
  infoBoxWrapper: {
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
    borderTopColor: "#dddddd",
    borderTopWidth: 1,
    height: 100,
  },
  infoBox: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  menuWrapper: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: "#000",
    marginLeft: 20,
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 26,
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
});
