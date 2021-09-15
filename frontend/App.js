import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button, PermissionsAndroid, RefreshControlBase, StyleSheet, Text, View } from 'react-native';
import { io } from "socket.io-client";
import { Buffer } from 'buffer';
import RNFS from 'react-native-fs';
import SoundPlayer from 'react-native-sound-player'
import 'react-native-url-polyfill/auto';

import LiveAudioStream from 'react-native-live-audio-stream';

export default function App() {

  var socket;
  var roomid = 0;
  let record = () => {
    const options = {
      sampleRate: 16000,  // default is 44100 but 32000 is adequate for accurate voice recognition
      channels: 1,        // 1 or 2, default 1
      bitsPerSample: 16,  // 8 or 16, default 16
      audioSource: 6,     // android only (see below)
      bufferSize: 4096    // default is 2048
    };
    console.log('button pressed')

    LiveAudioStream.init(options);
    LiveAudioStream.on('data', data => {
      var json = {
        roomid: roomid,
        audiodata: data
      }
      this.socket.emit('audio', json);
    });
    LiveAudioStream.start();
  }

  let stop = () => {
    LiveAudioStream.stop();
    this.socket.emit('leave_room', roomid);
  }

  let connect = () => {

    SoundPlayer.addEventListener('FinishedLoadingURL', ({ success, url }) => {
      console.log('finished loading url', success, url)
    })
    this.socket = new io('http://145.93.117.164:8000');
    this.socket.on('connect', () => {
      this.socket.emit('join_room', roomid);
      //SoundPlayer.playUrl('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
      console.log('connected')
    });
    
    var counter = 0;
    var base64String = "";
    var chunknum = 0;
    var base64data = "";
    this.socket.on('data_incoming', (data) => {
      console.log("incoming data: ");
      var chunk = Buffer.from(data, 'base64')
      var blob = new Blob([ chunk ], {type: "audio/wav"})
      console.log (blob.size);
      const url = "data:audio/wav;base64," + data; //URL.createObjectURL(blob.blob);
      const fileReaderInstance = new FileReader();
      fileReaderInstance.readAsDataURL(blob); 
      fileReaderInstance.onload = () => {
        this.base64data = fileReaderInstance.result;                
        console.log("1 (:" + this.base64data);
      }
      try {
        // or play from url
        console.log(this.base64data)
        SoundPlayer.playUrl(this.base64data);
      } catch (e) {
        console.log(`cannot play the sound file`, e)


    }
    });
    //   if (counter < 0){
    //     console.log(counter);
    //     base64String = base64String + data;
    //     counter++;
    //   }  else{
    //     console.log('creating wav file');
    //     counter = 0;
    //     const path = RNFS.ExternalDirectoryPath + "/chunk_num" + chunknum + '.wav'
    //     RNFS.writeFile(path, data, "base64")
    //     .then((success) => {
    //       console.log('wrote to file')
    //       console.log(success)
    //     })
    //     .catch((err) => {
    //       console.log(err)
    //     });
    //     chunknum++;

    //     SoundPlayer.playSoundFile(path.slice(0, path.length -4), 'wav')
        


    //   }
    // })
  }

  let send = () => {
    var json = {
      roomid: roomid,
      audiodata: "data"
    }
    this.socket.emit('audio', json);
  }
  





  return (
    <View style={styles.container}>
      <Text>Open up App. to start working on your app!</Text>
      <StatusBar style="auto" />
      <Button
        title="record"
        onPress={record}></Button>
      <Button
        title="stop"
        onPress={stop}></Button>
      <Button title="request permissions" onPress={requestMicrophonePermission} />

      <Button
        title="connect socket"
        onPress={connect}></Button>
      <Button
        title="send message socket"
        onPress={send}></Button>
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
