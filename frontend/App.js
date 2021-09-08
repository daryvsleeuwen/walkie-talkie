import {StatusBar} from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import * as Font from 'expo-font';
import {io} from 'socket.io-client';

export default function App() {
  let [fontsLoaded, setFontsLoaded] = useState(false);
  const socket = io('http://localhost:8000/');

  const loadFonts = async () => {
    await Font.loadAsync({
      PoppinsThin: require('./assets/fonts/Poppins-Thin.ttf'),
      PoppinsRegular: require('./assets/fonts/Poppins-Regular.ttf'),
      PoppinsMedium: require('./assets/fonts/Poppins-Medium.ttf'),
      PoppinsSemiBold: require('./assets/fonts/Poppins-Bold.ttf'),
      PoppinsBold: require('./assets/fonts/Poppins-SemiBold.ttf'),
    });

    setFontsLoaded(true);
  };


  useEffect(() => {
    loadFonts();
  });

  if (fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text style={styles.pageTitle}>pageTitle</Text>
      </View>
    );
  } else {
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    paddingBottom: 80,
    paddingLeft: 20,
    paddingRight: 20,
  },

  pageTitle: {
    fontFamily: 'PoppinsBold',
    fontSize: 32,
  },
});
