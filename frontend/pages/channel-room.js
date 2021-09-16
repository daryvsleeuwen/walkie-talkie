import React from 'react';
import LiveAudioStream from 'react-native-live-audio-stream';
import BackNavigation from '../components/back-navigator';
import {Button, PermissionsAndroid, RefreshControlBase, StyleSheet, Text, View} from 'react-native';
import {io} from 'socket.io-client';
import {Buffer} from 'buffer';
// import RNFS from 'react-native-fs';
import SoundPlayer from 'react-native-sound-player';
import 'react-native-url-polyfill/auto';
import styles from '../styles/misc';

var socket;
var roomid = 0;

let record = () => {
  const options = {
    sampleRate: 16000,
    channels: 1,
    bitsPerSample: 16,
    audioSource: 6,
    bufferSize: 4096,
  };

  LiveAudioStream.init(options);

  LiveAudioStream.on('data', (data) => {
    socket.emit('audio', {
      roomid: roomid,
      audiodata: data,
    });
  });

  LiveAudioStream.start();
};

let stop = () => {
  LiveAudioStream.stop();
  socket.emit('leave_room', roomid);
};

let connect = () => {
  SoundPlayer.addEventListener('FinishedLoadingURL', ({success, url}) => {
    console.log('finished loading url', success, url);
  });

  socket = io('http://145.93.117.164:8000');

  socket.on('connect', () => {
    socket.emit('join_room', roomid);
    //SoundPlayer.playUrl('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
    console.log('connected');
  });

  let counter = 0;
  let base64String = '';
  let chunknum = 0;
  let base64data = '';

  socket.on('data_incoming', (data) => {
    console.log('incoming data: ');
    let chunk = Buffer.from(data, 'base64');
    let blob = new Blob([chunk], {type: 'audio/wav'});

    const url = 'data:audio/wav;base64,' + data; //URL.createObjectURL(blob.blob);
    const fileReaderInstance = new FileReader();

    fileReaderInstance.readAsDataURL(blob);

    fileReaderInstance.onload = () => {
      base64data = fileReaderInstance.result;
      console.log('1 (:' + base64data);
    };
    try {
      console.log(base64data);
      SoundPlayer.playUrl(base64data);
    } catch (e) {
      console.log(`cannot play the sound file`, e);
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
};

let send = () => {
  socket.emit('audio', {
    roomid: roomid,
    audiodata: 'data',
  });
};

const requestMicrophonePermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, {
      title: 'Microphone usage',
      message: 'Please accept for microphone usage',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    });
  } catch (err) {
    console.warn(err);
  }
};

export default function ChannelRoom(props) {
  const {navigate} = props.navigation;
  const {frequency} = props.route.params;

  return (
    <View style={styles.container}>
      <View style={styles.pageTitleBox}>
        <BackNavigation navigate={navigate}></BackNavigation>
        <Text style={styles.pageTitle}>Channel {frequency}</Text>
      </View>

      <Button title="record" onPress={record}></Button>
      <Button title="stop" onPress={stop}></Button>
      <Button title="request permissions" onPress={requestMicrophonePermission} />

      <Button title="connect socket" onPress={connect}></Button>
      <Button title="send message socket" onPress={send}></Button>
    </View>
  );
}

const pageStyles = StyleSheet.create({});
