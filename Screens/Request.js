import { StyleSheet, Text, View, Dimensions} from 'react-native'
import React,{useState,useEffect,useContext,useRef,Button} from 'react'
import * as Notifications from 'expo-notifications';
import { collection, getFirestore,doc, setDoc, addDoc, updateDoc, deleteDoc, getDoc, getDocs, where, query ,onSnapshot} from "firebase/firestore"; 
import { latitudeKeys } from 'geolib';
import Loader from '../Components/Loader';
import { AuthContext } from './AuthProvider';
import MapViewDirections from 'react-native-maps-directions';
import MapView, { Marker , Polyline ,  AnimatedRegion , PROVIDER_GOOGLE} from 'react-native-maps';
import tailwind from 'tailwind-react-native-classnames';

const {width, height} = Dimensions.get("window");
const ASPECT_RATIO = width/ height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


const Request = ({route}) => {
  const  {data}  = route?.params
  const [Data, setData] = useState();
  const [latA, setlatA] = useState(null) 
  const [lngA, setlngA] = useState(null)
  const [latB, setlatB] = useState(null)
  const [lngB, setlngB] = useState(null)
  const [loading,setLoading] = useState(true)
  const [map, setMap] = useState(null);
  const mapRef = useRef()
  const markerRef = useRef()
  const  { user }  = useContext(AuthContext);
  const [Visible, setVisible] = useState(false); 
  const [state, setState] = useState({
    curLoc: {
        latitude: 30.7046,
        longitude: 77.1025,
        latitudeDelta:LATITUDE_DELTA,
        longitudeDelta:LONGITUDE_DELTA
    },
   
    time: 0,
    distance: 0,
    heading: 0,
    marginBottom:1

})
/* 
   Notifications.addNotificationResponseReceivedListener((response) => {
      Notifications.DEFAULT_ACTION_IDENTIFIER 
   
   var stringWithCommas = JSON.stringify(response.notification.request.content.data.someData)
   var stringWithoutCommas = JSON.parse(stringWithCommas);
   setData(stringWithoutCommas)
    
 
   }); */
 
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

  const { curLoc, time, distance, marginBottom , destinationCords, isLoading, coordinate,heading } = state
    const updateState = (data) => setState((state) => ({ ...state, ...data }));

    useEffect(() => {
    
    const db= getFirestore();
    console.log(data)
    const unsubscribe =   collection(db, 'location');
          const q = query(unsubscribe, where("number", "==", data ));
          onSnapshot(q, (snapshot) => {
              const detas = snapshot.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                  }))
                 
                  setlatB(detas[0].lat)
                  setlngB(detas[0].lng) 
                  setLoading(false)
              })
          
  }, [3000])


  const fetchTime = (d, t) => {
    updateState({
        distance: d,
        time: t
    })
  }


   useEffect(() => {
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
                  setLoading(false)
                  setVisible(true)
              }) 
  }, []) 
          
 

  return (
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
      provider={MapView.PROVIDER_GOOGLE}
      showsUserLocation={true} 
      followsUserLocation={true}
    showsMyLocationButton={true}
      ref={(map) => setMap(map)}
     
        style={{...StyleSheet.absoluteFill }}
        initialRegion={curLoc}
     
   >
   
             
  
        <Marker.Animated
        ref={markerRef}
        coordinate={{latitude:latB , longitude:lngB}}

      >
       
      </Marker.Animated>
      
      
   
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
   
    </View>
   
  )
}

export default Request

const styles = StyleSheet.create({
  container:{
    flex: 1,
    margin:0,
  }
})