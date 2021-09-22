import React from 'react';
import LiveAudioStream from 'react-native-live-audio-stream';
import BackNavigation from '../components/back-navigator';
import {Animated, PermissionsAndroid, StyleSheet, Text, View, Pressable, Easing} from 'react-native';
import {io} from 'socket.io-client';
import {Buffer} from 'buffer';
import RNFS from 'react-native-fs';
import SoundPlayer from 'react-native-sound-player';
import 'react-native-url-polyfill/auto';
import JoinedUser from '../components/joined-user';
import styles from '../styles/misc';
import Sound from 'react-native-sound';

let socket;
let roomid = 0;
const options = {
  sampleRate: 16000,
  channels: 1,
  bitsPerSample: 16,
  audioSource: 6,
  bufferSize: 4096,
};

LiveAudioStream.init(options);

var audioData;
LiveAudioStream.on('data', (data) => {
  socket.emit('audio', {
    roomid: roomid,
    audiodata: data,
  });
  audioData += data;
})

let leaveRoom = () => {
  LiveAudioStream.stop();
  socket.emit('leave_room', roomid);
};

let connect = () => {
  SoundPlayer.addEventListener('FinishedLoadingURL', ({success, url}) => {
    console.log('finished loading url', success, url);
  });

  socket = io('http://145.93.117.223:8000');

  socket.on('connect', () => {
    socket.emit('join_room', roomid);
    //SoundPlayer.playUrl('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
  });

  let base64data = '';
  let chunknum = 0;
  let counter = 0;
  socket.on('data_incoming', (data) => {
    //const url = 'data:audio/x-wav;base64,' + "UklGRiR9AABXQVZFZm10IBAAAAABAAEAgD4AAAB9AAACABAAZGF0YQB9" + data; //URL.createObjectURL(blob.blob);
    if (counter > 10){
      const path = RNFS.ExternalDirectoryPath + "/chunk_num" + chunknum + '.wav';
        RNFS.writeFile(path, "UklGRiR9AABXQVZFZm10IBAAAAABAAEAgD4AAAB9AAACABAAZGF0YQB9" + base64data, "base64")
        .then((success) => {
          console.log('wrote to file')
          console.log(path);
            console.log('trying to play...');
            try {
              var sound = new Sound(path);
              sound.play();
              //SoundPlayer.playSoundFile(path);
            } catch (error) {
              console.log(error.message)
            }
            
          
        })
        .catch((err) => {
          console.log(err.message)
        });
      chunknum++;
      counter = 0;
    }else{
      base64data = base64data + data;
      counter++;
    }


    
  });
};

let send = () => {
  console.log('starting audio stream...');
  LiveAudioStream.start();
};

let stopSending = () => {
  console.log('stopping audio stream...');
  LiveAudioStream.stop();
}

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
  const animatedButtonScale = new Animated.Value(1);
  connect();

  const scaleButtonDown = () => {
    Animated.timing(animatedButtonScale, {
      toValue: 0.8,
      duration: 300,
      easing: Easing.bezier(.38,.46,.08,.91),
      useNativeDriver: true,
    }).start();
  };

  const scaleButtonUp = () => {
    Animated.timing(animatedButtonScale, {
      toValue: 1,
      easing: Easing.bezier(.38,.46,.08,.91),
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.pageTitleBox}>
        <BackNavigation navigate={navigate} onBack={leaveRoom}></BackNavigation>
        <Text style={styles.pageTitle}>Channel {frequency}</Text>
      </View>

      {/* Display all clients in channel */}
      <View style={styles.pageContent}>
        <JoinedUser userName="talker#24523" talking={true}></JoinedUser>
      </View>

      <View style={pageStyles.pushToTalkCenterer}>
        <Animated.View style={{transform: [{scale: animatedButtonScale}]}}>
          <Pressable
            style={pageStyles.pushToTalkbutton}
            onPressIn={() => {
              scaleButtonDown();
              send();
            }}
            onPressOut={() => {
              scaleButtonUp();
              stopSending();
            }}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={pageStyles.pushToTalkText}>Push me</Text>
            </View>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const pageStyles = StyleSheet.create({
  pushToTalkCenterer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  pushToTalkbutton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FF4848',
    borderWidth: 3,
    borderColor: '#272727',
    padding: 10,
    alignItems: 'center',
  },

  pushToTalkText: {
    fontSize: 20,
    fontFamily: 'Poppins-Medium',
    color: '#ffffff',
    textAlign: 'center',
  },
});
