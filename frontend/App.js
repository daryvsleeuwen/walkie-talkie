import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button, PermissionsAndroid, SafeAreaView, StyleSheet, Text, View } from "react-native";

import LiveAudioStream from 'react-native-live-audio-stream';
import Recording from 'react-native-recording'


export default function App() {
  let record = () => {
    Recording.init({
      bufferSize: 4096,
      sampleRate: 44100,
      bitsPerChannel: 16,
      channelsPerFrame: 1,
    });
     
    const listener = Recording.addRecordingEventListener((data) =>
      console.log(data)
    );
     
    Recording.start();

  }

    // const options = {
    //   sampleRate: 16000, // default 44100
    //   channels: 1, // 1 or 2, default 1
    //   bitsPerSample: 16, // 8 or 16, default 16
    //   audioSource: 6, // android only (see below)
    //   bufferSize: 4096 * 2, // default is 2048
    // }
    
    // console.log(LiveAudioStream);
    
    // LiveAudioStream.init(options)
    // LiveAudioStream.on('data', data => {
    //   console.log(data);
    //   //base64-encoded audio data chunks
    // });
    
    
    // LiveAudioStream.start();
    // }

  

  return (
    <View style={styles.container}>
      <Text>Open up App.jss to start working on your app!</Text>
      <StatusBar style="auto" />
      <Button 
        onPress={record}
        title="recordbutton" ></Button>
      <Button title="request permissions" onPress={requestMicrophonePermission} />
    </View>
  );
  
  
}

const requestMicrophonePermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: "Microphone usage",
          message:
           "Please accept for microphone usage",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      console.log(granted)
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Permission granted")
      } else {
        console.log("Microphone permission denied");
      }
  } catch (err) {
    console.warn(err);
  }

}

  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
