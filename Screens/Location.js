import React, {useEffect,useState,Component,useContext,useRef} from 'react';
import { View, Text,StyleSheet,TouchableOpacity,ScrollView, Button, Modal,Pressable,Alert, Dimensions,Platform} from 'react-native';
import MapView, { Marker , Polyline ,  AnimatedRegion , PROVIDER_GOOGLE} from 'react-native-maps';
import { onValue,getDatabase, ref, child, get,set} from "firebase/database";
import { useDispatch, useSelector } from 'react-redux';
import { selectContacts, updateContacts,updateRecords , selectRecords,selectLocation , selectLists , selectUsers, updateUsers,selectName} from '../redux/slices/dataSlice';
import { collection, getFirestore,doc, setDoc, addDoc, updateDoc, deleteDoc, getDoc, getDocs, where, query ,onSnapshot} from "firebase/firestore"; 
import { MaterialIcons } from '@expo/vector-icons';
import Loader from '../Components/Loader';
import { AuthContext } from './AuthProvider';
import { getDistance, getPreciseDistance } from 'geolib';
import MapViewDirections from 'react-native-maps-directions';
import tailwind from 'tailwind-react-native-classnames';
import * as Notifications from 'expo-notifications';

const {width, height} = Dimensions.get("window");
const ASPECT_RATIO = width/ height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;




const Location = ({route,navigation}) => {
  const { subject, image, type, users, id } = route?.params?.chat
  const [latA, setlatA] = useState(null) 
  const [lngA, setlngA] = useState(null)
  const [latB, setlatB] = useState(null)
  const [lngB, setlngB] = useState(null)
  
  const [loading,setLoading] = useState(true)
  const [region, setregion] = useState('')
  const [loadingFetch, setLodingFetch] = useState(false)
  const dispatch = useDispatch()
  const contacts = useSelector(selectContacts)
  const records = useSelector(selectRecords)
  const car = useSelector(selectLocation)
  const [selected, setSelected] = useState([])
  const [showModal, setShowModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [Visible, setVisible] = useState(false);
  const  { user }  = useContext(AuthContext);
  const [showMap, setShowMap] = React.useState(false);
  const [map, setMap] = useState(null);
  const mapRef = useRef()
  const markerRef = useRef()
  const use = useSelector(selectUsers)
  const Name = useSelector(selectName);

  const [location, setLocation] = useState({latitude: 33.7382699,
    longitude: 72.8052427,
    latitudeDelta:LATITUDE_DELTA,
    longitudeDelta:LONGITUDE_DELTA});
    const [state, setState] = useState({
      curLoc: {
        latitude: 33.7382699,
        longitude: 72.8052427,
          latitudeDelta:LATITUDE_DELTA,
          longitudeDelta:LONGITUDE_DELTA
      },
     
      time: 0,
      distance: 0,
      heading: 0,
      marginBottom:1

  })
  const { curLoc, time, distance, marginBottom , destinationCords, isLoading, coordinate,heading } = state
    const updateState = (data) => setState((state) => ({ ...state, ...data }));
     
const INITIAL_REGION = {
  latitude: 33.7382699,
  longitude: 72.8052427,
  
}





var calculateDistance = (A,B,C , D) => {
  var dis = getDistance(
    { latitude: A, longitude: B },
    { latitude: C, longitude: D }
  );
  updateState({
    distance: dis/1000,
    time:1
})
};

var calculatePreciseDistance = (A,B,C , D) => {
  var pdis = getPreciseDistance(
    { latitude: A, longitude: B },
    { latitude: C, longitude: D }
  );
  updateState({
    distance: pdis/1000,
    time:1
})
};

 




  const coordinates = [
    
    {
      latitude: latA,
      longitude: lngA,
    },
    {
      latitude: latB,
      longitude:lngB,
    }
    
    
  ];




 


  useEffect(() => {
    let isMounted = true;
    setLodingFetch(true)
  
    const db= getFirestore();
    const unsubscribe =   collection(db, 'location');
    onSnapshot(unsubscribe, (snapshot) => {
        const datas = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            }))
            console.log(datas)
            const filtered = removeExistingContacts(datas)
            console.log(filtered)
            if (isMounted){
            dispatch(updateContacts(filtered))
            setLoading(false)
            }
            setLodingFetch(false)
        }) 
    
       
        return () => {
          // 👇️ when component unmounts, set isMounted to false
          isMounted = false;
        };
  
  
  }, [])

  useEffect(() => {
    let isMounted = true;
    setLodingFetch(true)
  
    const db= getFirestore();
    const unsubscribe =   collection(db, 'users');
    const q = query(unsubscribe, where("number", "!=", user.phoneNumber),  where("car", "==", "Yes"));
    
    onSnapshot(q, (snapshot) => {
        const datas = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            }))
            console.log(datas)
            const filtered = removeContacts(datas)
            console.log(filtered)
            if (isMounted){
            dispatch(updateUsers(filtered))
            setLoading(false)
            }
            setLodingFetch(false)
        }) 
    
       
        return () => {
          // 👇️ when component unmounts, set isMounted to false
          isMounted = false;
        };
  
  
  }, [])

  const removeContacts = (datas) => {
    const userEmails = users.map(x => x.number)
    return datas.filter(x => userEmails.includes(x.number))
  }

  useEffect(() => {
    let isMounted = true;
    setLodingFetch(true)
  
    const db= getFirestore();
    const unsubscribe =   collection(db, 'location');
    const q = query(unsubscribe, where("number", "!=", user.phoneNumber));
    onSnapshot(q, (snapshot) => {
        const datas = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            }))
            console.log(datas)
            const filtered = removeExistingContacts(datas)
            console.log(filtered)
            if (isMounted){
            dispatch(updateRecords(filtered))
            setLoading(false)
            }
            setLodingFetch(false)
        }) 
    
       
        return () => {
          // 👇️ when component unmounts, set isMounted to false
          isMounted = false;
        };
  
  
  }, [])
  
  const removeExistingContacts = (datas) => {
    const userEmails = users.map(x => x.number)
    return datas.filter(x => userEmails.includes(x.number))
  }
  
  
  useEffect(() => {
  setLoading(true)
  const db= getFirestore();

  const unsubscribe =   collection(db, 'location');
        const q = query(unsubscribe, where("number", "==", user.phoneNumber));
        onSnapshot(q, (snapshot) => {
            const datas = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                }))
                setlatA(datas[0].lat)
                setlngA(datas[0].lng)
                let A = datas[0].lat;
                let B = datas[0].lng;
                updateState({
                  
                  curLoc: { latitude:A, longitude:B,latitudeDelta:LATITUDE_DELTA,longitudeDelta:LONGITUDE_DELTA},
                  
              })
            
                setShowMap(true);
                setLoading(false)
                
            }) 

           
           
          
   /*  const index = selected?.findIndex(x => x.number === select.number)
    setSelected([select, ...selected]) */
    /* const userEmails = item.map(x => x.number)
    return datas.filter(x => userEmails.includes(x.number)) */
    
  

}, [])
          
     
const centerMap = () => {
    map.animateToRegion(state);
  };

  const filterContacts = select =>{
    
    setLoading(true)
    setModalVisible1(!modalVisible1)
    
  
    console.log(select.number)
   const db= getFirestore();

  const unsubscribe =   collection(db, 'Token');
        const q = query(unsubscribe, where("number", "==", select.number));
        onSnapshot(q, (snapshot) => {
            const datas = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                }))
                console.log(datas[0].token)
                sendPushNotification(datas[0].token,datas[0].name , select.number)
                  setShowMap(true);
                  setLoading(false)               
              
            })  
           
            
   /*  const index = selected?.findIndex(x => x.number === select.number)
    setSelected([select, ...selected]) */
    /* const userEmails = item.map(x => x.number)
    return datas.filter(x => userEmails.includes(x.number)) */
    
  }
  useEffect(() => {
   

  Notifications.addNotificationResponseReceivedListener((response) => {
    /* Notifications.DEFAULT_ACTION_IDENTIFIER */
    var stringWithCommas = JSON.stringify(response.notification.request.content.data.someData)
 var data = JSON.parse(stringWithCommas);

 
 console.log(data);
   if(response.actionIdentifier === 'no'){
    
    Notifications.dismissAllNotificationsAsync()
    Notifications.dismissNotificationAsync()
   }
   else if (response.actionIdentifier === 'yes'){
    
    navigation.navigate('Requests', { data:data } )
    Notifications.dismissAllNotificationsAsync()  
   }
   else{
    navigation.navigate('Home')
   }
  });

}, []);
  


  Notifications.setNotificationCategoryAsync('welcome', [
    {
      buttonTitle: `Reject`,
      identifier: 'no',
      options: {
        opensAppToForeground: false,
        isDestructive:true
      },
      
    },
    {
      identifier: 'yes',
      buttonTitle: 'Accept',
      options: {
        opensAppToForeground: false,
      },
  },
  
  
  ])
    .then((_category) => {})
    .catch((error) => console.warn('Could not have set notification category', error));


  async function sendPushNotification(expoPushToken, name , number) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Ride Request',
      body: `${Name} send you a request to share ride`,
      data: { someData: `${user.phoneNumber}`},
      categoryId: 'welcome',
    };
  
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  }

  const filterExistingContacts = select =>{
    
    setLoading(true)
    setModalVisible(!modalVisible)
    
  setlatB(select.lat)
  setlngB(select.lng)
 
   const db= getFirestore();

  const unsubscribe =   collection(db, 'location');
        const q = query(unsubscribe, where("number", "==", user.phoneNumber));
        onSnapshot(q, (snapshot) => {
            const datas = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                }))
                setlatA(datas[0].lat)
                setlngA(datas[0].lng)
                let A = datas[0].lat;
                let B = datas[0].lng;
               /*  calculatePreciseDistance(datas[0].lat  ,  datas[0].lng  ,  select.lat  ,  select.lng  ); */
                updateState({
                  
                  curLoc: { latitude:A, 
                            longitude:B,
                            latitudeDelta:LATITUDE_DELTA,
                            longitudeDelta:LONGITUDE_DELTA},
                  
              })
                  setShowMap(true);
                  setLoading(false)               
              
            })  
           
            setVisible(true);
   /*  const index = selected?.findIndex(x => x.number === select.number)
    setSelected([select, ...selected]) */
    /* const userEmails = item.map(x => x.number)
    return datas.filter(x => userEmails.includes(x.number)) */
    
  }




  const animate = (A, B) => {
    const newCoordinate = { A, B };
    if (Platform.OS == 'android') {
        if (markerRef.current) {
            markerRef.current.animateMarkerToCoordinate(newCoordinate, 7000);
        }
    } else {
        coordinate.timing(newCoordinate).start();
    }
  }
  



  const goToMyLocation = async () => {
    mapRef.current.animateCamera({center: {"latitude":location.coords.latitude, "longitude": location.coords.longitude}});
}

const mapRegionChangehandle = (region) => {
  setState(region);
};


const fetchTime = (d, t) => {
  updateState({
      distance: d,
      time: t
  })
}


const Button =()=>{
  updateState({
    marginBottom:0
  })
}
 
 

  
    return(

      <View style={styles.container}>   
          
        {distance !== 0 && time !== 0 && (<View style={tailwind`bg-white ml-14 mr-14 h-20 mt-2 justify-center z-50 items-center rounded-sm `}>
                <Text>Time left: {time.toFixed(0)} Min</Text>
                <Text>Distance left: {distance} KM</Text>
            </View>)}
     
 { loading?
    (
      <Loader visible={loading} />)
     : (
      <MapView  
      provider={PROVIDER_GOOGLE}
      showsUserLocation={true} 
      followsUserLocation={true}
    showsMyLocationButton={true}
      ref={(map) => setMap(map)}
     
        style={{...StyleSheet.absoluteFill }}
        initialRegion={curLoc}
       onMapReady={() => Button()}
   >
   
             
   {contacts?.map(item => {
    return (
        <Marker.Animated
        ref={markerRef}
        key={item.number}
        coordinate={{latitude:item.lat , longitude:item.lng}}
        title={item?.name}
        
      >
       
      </Marker.Animated>
      
      
    )
    
    }
      )} 
       { !Visible?
    (
      <></>)
     : (
     
             <MapViewDirections
                        origin={coordinates[0]}
                        destination={coordinates[1]}
                       apikey={""}
                        strokeWidth={6}
                        strokeColor="blue"
                       
                        onStart={(params) => {
                            console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                        }}
                        onReady={result => {
                            console.log(`Distance: ${result.distance} km`)
                            console.log(`Duration: ${result.duration} min.`)
                            fetchTime(result.distance, result.duration)
                                
                        }}
                        onError={(errorMessage) => {
                            // console.log('GOT AN ERROR');
                        }}
                    />
                )
    }  
      </MapView>
     )
    }

    <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          
          setModalVisible(!modalVisible);
        }}>
       
        <View style={[tailwind`mt-32`,{flex:0.39,
     justifyContent:'center',
     alignItems:'center',}]} >
        
          <View style={styles.modalView}>
            <Text style={styles.text}>Friends/Family</Text>
             <ScrollView >
            {records?.map(item => (
                        <View key={item.number} style={{alignItems:'center'}} >
                            
                            <TouchableOpacity style={tailwind` py-2`}  onPress={() => filterExistingContacts(item)}>
                                <Text style={[tailwind`text-black font-bold items-center justify-center`, { fontSize: 16 }]} numberOfLines={1}>{item?.name}</Text>
                                <Text style={tailwind`text-gray-600 text-xs items-center justify-center`} numberOfLines={1}>{item?.number}</Text>
                            </TouchableOpacity>
                           
                            
                            
                        </View>
                    ))}
          
                    </ScrollView>
            {/* <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable> */}
          </View>
        </View>
       
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible1}
        onRequestClose={() => {
          
          setModalVisible1(!modalVisible1);
        }}>
       
        <View style={[tailwind`mt-32`,{flex:0.39,
     justifyContent:'center',
     alignItems:'center',}]} >
        
          <View style={styles.modalView}>
            <Text style={styles.text}> Send Request</Text>
             <ScrollView >
            {use?.map(item => (
                        <View key={item.number} style={{alignItems:'center'}} >
                            
                            <TouchableOpacity style={tailwind` py-2`}  onPress={() => filterContacts(item)}>
                                <Text style={[tailwind`text-black font-bold items-center justify-center`, { fontSize: 16 }]} numberOfLines={1}>{item?.name}</Text>
                                <Text style={tailwind`text-gray-600 text-xs items-center justify-center`} numberOfLines={1}>{item?.number}</Text>
                            </TouchableOpacity>
                           
                            
                            
                        </View>
                    ))}
          {use === null &&(
            <Text>No one have car</Text>
          )}
                    </ScrollView>
            {/* <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable> */}
          </View>
        </View>
       
      </Modal>
      {car === 'No' && (
      <TouchableOpacity onPress={() => setModalVisible1(true)} style={tailwind`bg-blue-500 w-16 h-16 rounded-full items-center justify-center shadow absolute bottom-4 right-4 z-50`}>
                <MaterialIcons name="directions-car" size={26} color="white" />
            </TouchableOpacity> 
            )}
      {car === 'Yes' &&(
     <TouchableOpacity onPress={() => setModalVisible(true)} style={tailwind`bg-blue-500 w-16 h-16 rounded-full items-center justify-center shadow absolute bottom-4 right-4 z-50`}>
                <MaterialIcons name="directions" size={26} color="white" />
            </TouchableOpacity> 
            )}
    </View>
);
    }
export default Location;
const styles = StyleSheet.create({
    container: {
      flex: 1,
      margin:0,
    },
    panelHeader: {
      alignItems: 'center',
    },
    panelHandle: {
      width: 40,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#00000040',
      marginBottom: 10,
    },
    panelTitle: {
      fontSize: 27,
      height: 35,
    },
    panelSubtitle: {
      fontSize: 14,
      color: 'gray',
      height: 30,
      marginBottom: 10,
    },
    panelButton: {
      padding: 13,
      borderRadius: 10,
      backgroundColor: '#5B79E0',
      alignItems: 'center',
      marginVertical: 7,
    },
    panelButtonTitle: {
      fontSize: 17,
      fontWeight: 'bold',
      color: 'white',
    },
    panel: {
      padding: 20,
      backgroundColor: '#FFFFFF',
      paddingTop: 20,
      // borderTopLeftRadius: 20,
      // borderTopRightRadius: 20,
      // shadowColor: '#000000',
      // shadowOffset: {width: 0, height: 0},
      // shadowRadius: 5,
      // shadowOpacity: 0.4,
    },
    modal: {
     
      alignItems: 'center',
      backgroundColor: '#00ff00',
      padding: 100,
    },
    text: {
      color: '#3f2949',
      marginTop: 6,
    },
    centeredView: {
     
     justifyContent:'center',
     alignItems:'center',
      
    },
    modalView: {
     
      margin: 20,
      backgroundColor: 'white',
      borderRadius:8,
      padding: 38,
      alignItems: 'center',
      shadowColor: '#000',
     
      shadowOffset: {
        width: 0,
        height: 2,
      },
    
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      borderRadius: 12,
      padding: 10,
      elevation: 2,
    },
    buttonOpen: {
      backgroundColor: '#F194FF',
    },
    buttonClose: {
      backgroundColor: '#2196F3',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
})