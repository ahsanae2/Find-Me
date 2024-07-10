import React, {useEffect,useState,Component,useContext } from 'react'
import { StyleSheet,   View } from 'react-native';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple,
    Switch,
    DarkTheme
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { collection, getFirestore,doc, setDoc, addDoc, updateDoc, deleteDoc, getDoc, getDocs, where,getAuth, query } from "firebase/firestore";
import firebase from '../Components/firebaseConfig';
import Loader from '../Components/Loader';


export function DrawerContent(props,navigation) {
    const [name, setName] = useState('')
    const [loading, setLoding] = useState(false)

   
    
    signout = () =>{
    
        firebase.auth().signOut().then(() =>{
            
       
        
        })
    
    }
    

   

    return (
        
        <View style={{flex:1,}} >
            <DrawerContentScrollView  {...props}>
               <View style={styles.DrawerContent}>
               <Loader visible={loading} />
                   
                      <View style={styles.userInfoSection}>
                          <View style={{flexDirection:'row', marginTop: 15 }}>
                              <Avatar.Image
                               source={require('../assets/avatars.png')}
                              size={50}
                              />
                              <View style={{ marginLeft:15, flexDirection:'column'}}>
                                  <Title style={styles.title}>
                                   {name}
                                  </Title>
                                  {/* <Caption style={styles.Caption}>ahsanali@gmail.com</Caption> */}
                              </View>
                          </View>
                      </View>
                   <Drawer.Section style={styles.drawerSection}>
                   <DrawerItem 
                    icon={({color,size})=>(
                        <Icon 
                        name="home-outline"
                        color={color}
                        size={size}
                        />
                    )}
                    label="Home"
                    onPress={()=> {props.navigation.navigate('Home')}}
                />

                 <DrawerItem 
                    icon={({color,size})=>(
                        <Icon 
                        name="account-arrow-left-outline"
                        color={color}
                        size={size}
                        />
                    )}
                    label="Requests"
                    onPress={()=> {props.navigation.navigate('Settings')}}
                />
                <DrawerItem 
                    icon={({color,size})=>(
                        <Icon 
                        name="account-outline"
                        color={color}
                        size={size}
                        />
                    )}
                    label="Profile"
                    onPress={()=> {props.navigation.navigate('Profile')}}
                />
                
                {/* <DrawerItem 
                    icon={({color,size})=>(
                        <Icon 
                        name="account-edit-outline"
                        color={color}
                        size={size}
                        />
                    )}
                    label="Update Profile"
                    onPress={()=> {props.navigation.navigate('EditProfile')}}
                /> */}
                
                
                   </Drawer.Section>
                  {/*  <Drawer.Section title="Preferences">
                     <TouchableRipple onPress={()=>{toggleTheme()}}>
                         <View style={styles.preference}>
                             <Text> Dark Theme</Text>
                             <View pointerEvents='none'>
                            
                             </View>
                         </View>
                     </TouchableRipple>
                   </Drawer.Section> */}

               </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}> 
                <DrawerItem 
                    icon={({color,size})=>(
                        <Icon 
                        name="exit-to-app"
                        color={color}
                        size={size}
                        />
                    )}
                    label="Sing Out"
                    onPress={()=> { this.signout() }}
                />
            </Drawer.Section>
        </View>
    
    )
}

const styles = StyleSheet.create({
 DrawerContent:{
     flex:1,
     
 },
 userInfoSection:{
     paddingLeft:20
 },
 title:{
     fontSize:16,
     marginTop:3,
     fontWeight:'bold'
 },
 Caption:{
     fontSize:14,
     lineHeight:14,
 },
 row:{
     marginTop:20,
     flexDirection:'row',
     alignItems:'center'
 },
 section:{
     flexDirection:'row',
     alignItems:'center',
    marginRight:15,
 },
 paragraph:{
  fontWeight:'bold'
 },
 drawerSection:{
     marginTop:15
 },
 bottomDrawerSection:{
    marginBottom:15,
    borderTopColor:'#f4f4f4',
    borderTopWidth:1
 },
 preference:{
     flexDirection:'row',
     justifyContent:'space-between',
     paddingVertical:13,
     paddingHorizontal:16,
 }
})