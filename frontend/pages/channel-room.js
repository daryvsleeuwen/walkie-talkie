import React from 'react';
import LiveAudioStream from 'react-native-live-audio-stream';
import BackNavigation from '../components/back-navigator';
import {Animated, PermissionsAndroid, StyleSheet, Text, View, Pressable, Easing} from 'react-native';
import {io} from 'socket.io-client';
import {Buffer} from 'buffer';
// import RNFS from 'react-native-fs';
import SoundPlayer from 'react-native-sound-player';
import 'react-native-url-polyfill/auto';
import JoinedUser from '../components/joined-user';
import styles from '../styles/misc';

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

LiveAudioStream.on('data', (data) => {
  socket.emit('audio', {
    roomid: roomid,
    audiodata: data,
  });
});

let leaveRoom = () => {
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
  });

  let counter = 0;
  let base64String = '';
  let chunknum = 0;
  let base64data = '';

  socket.on('data_incoming', (data) => {
    let chunk = Buffer.from(data, 'base64');
    let blob = new Blob([chunk], {type: 'audio/wav'});

    const url = 'data:audio/wav;base64,' + data; //URL.createObjectURL(blob.blob);
    const fileReaderInstance = new FileReader();

    fileReaderInstance.readAsDataURL(blob);

    fileReaderInstance.onload = () => {
      base64data = fileReaderInstance.result;
    };
    try {
      console.log(base64data);
      SoundPlayer.playUrl(base64data);
    } catch (e) {}
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
  console.log('sending data');

  // socket.emit('audio', {
  //   roomid: roomid,
  //   audiodata: 'data',
  // });
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
              LiveAudioStream.start();
              send();
            }}
            onPressOut={() => {
              scaleButtonUp();
              LiveAudioStream.stop();
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
