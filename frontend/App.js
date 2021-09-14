import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button,PermissionsAndroid , StyleSheet, Text, View } from 'react-native';

import LiveAudioStream from 'react-native-live-audio-stream';

export default function App() {

  let record = () => {
    console.log("recording...")
    const options = {
    sampleRate: 32000,  // default is 44100 but 32000 is adequate for accurate voice recognition
    channels: 1,        // 1 or 2, default 1
    bitsPerSample: 16,  // 8 or 16, default 16
    audioSource: 6,     // android only (see below)
    bufferSize: 4096    // default is 2048
  };
  
  LiveAudioStream.init(options);
  LiveAudioStream.on('data', data => {
    console.log("received audio packet");
    // base64-encoded audio data chunks
  });
  LiveAudioStream.start();
  }

  let stop = () => {
    LiveAudioStream.stop();
  }



  return (
    <View style={styles.container}>
      <Text>Open up App.jsss to start working on your app!</Text>
      <StatusBar style="auto" />
      <Button
        title="record"
        onPress={record}></Button>
        <Button
        title="stop"
        onPress={stop}></Button>
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
