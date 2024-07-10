import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Main from './Screens/Tabs'
import { AuthProvider } from './Screens/AuthProvider';
import { store } from "./redux/store";
import { Provider } from "react-redux";
const App = () => {
  return (
    <AuthProvider>
    <Provider  store={store}>
  
   
  
      <Main />
    
    </Provider>
    </AuthProvider>
   
  )
}

export default App

const styles = StyleSheet.create({})