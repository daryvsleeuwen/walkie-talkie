import React from 'react';
import { useEffect } from 'react';
import LiveAudioStream from 'react-native-live-audio-stream';
import BackNavigation from '../components/back-navigator';
import { Animated, PermissionsAndroid, StyleSheet, Text, View, Pressable, Easing } from 'react-native';
import { io } from 'socket.io-client';
import { Buffer } from 'buffer';
import RNFS from 'react-native-fs';
import SoundPlayer from 'react-native-sound-player';
import 'react-native-url-polyfill/auto';
import JoinedUser from '../components/joined-user';
import styles from '../styles/misc';
import RtcEngine from 'react-native-agora'
// import Sound from 'react-native-sound';

let joined = false;
const options = {
  sampleRate: 16000,
  channels: 1,
  bitsPerSample: 16,
  audioSource: 6,
  bufferSize: 4096,
};

LiveAudioStream.init(options);

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

let state = {
  appId: `973ff918e3064ce4ba5e71bac6d06267`,
  token: '006973ff918e3064ce4ba5e71bac6d06267IADbdLrlhAcym0Fbb3hJwyH4bmNhtk+VLfiiPL4cg2AgdwZa8+gAAAAAEACtrEr9HdtOYQEAAQAd205h',
  channelName: 'testing',
  openMicrophone: true,
  enableSpeakerphone: true,
  joinSucceed: false,
  peerIds: [],
}



const animatedButtonScale = new Animated.Value(1);

export default function ChannelRoom(props) {
  const { navigate } = props.navigation;
  let { roomid, frequency, socket } = props.route.params;
  let [joinedUsers, setJoinedUsers] = React.useState([]);

  let audioData;
  let base64data = '';
  let chunknum = 0;
  let counter = 0;
  let mounted = false;

  LiveAudioStream.on('data', (data) => {
    socket.emit('audio', {
      roomid: roomid,
      audiodata: data,
    });
  });

  useEffect(() => {
    mounted = true;

    return () => {
      mounted = false;
    };
  }, []);

  if (!joined) {
    socket.emit('join_room', roomid);
    joined = true;

    socket.on('update_joined_users', (joinedUsers) => {
      if (mounted) {
        setJoinedUsers(joinedUsers);
      }
    });

    socket.on('data_incoming', (data) => {
      //const url = 'data:audio/x-wav;base64,' + "UklGRiR9AABXQVZFZm10IBAAAAABAAEAgD4AAAB9AAACABAAZGF0YQB9" + data; //URL.createObjectURL(blob.blob);
      if (counter > 10) {
        const path = RNFS.ExternalDirectoryPath + '/chunk_num' + chunknum + '.wav';
        RNFS.writeFile(path, 'UklGRiR9AABXQVZFZm10IBAAAAABAAEAgD4AAAB9AAACABAAZGF0YQB9' + base64data, 'base64')
          .then((success) => {
            try {
              let sound = new Sound(path);
              sound.play();
            } catch (error) {
              console.log(error.message);
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
        chunknum++;
        counter = 0;
      } else {
        base64data = base64data + data;
        counter++;
      }
    });

    //AGORA
    let engine;
    RtcEngine.create(state.appId).then(rtcEngine => {
      engine = rtcEngine;

      console.log(engine)
      engine.enableAudio();

      engine.addListener('UserJoined', (uid, elapsed) => {
        console.log('User joined', uid, elapsed)
      })

      engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
        console.log('JoinChannelSuccess', channel, uid, elapsed)
      })

      engine.joinChannel(state.token, state.channelName, null, 0);
    })




    const leaveRoom = () => {
      LiveAudioStream.stop();
      socket.emit('leave_room', roomid);
      joined = false;
    };

    const send = () => {
      LiveAudioStream.start();
      socket.emit('set_talking_state', true);
    };

    const stopSending = () => {
      LiveAudioStream.stop();
      socket.emit('set_talking_state', false);
    };

    const scaleButtonDown = () => {
      Animated.timing(animatedButtonScale, {
        toValue: 0.8,
        duration: 300,
        easing: Easing.bezier(0.38, 0.46, 0.08, 0.91),
        useNativeDriver: true,
      }).start();
    };

    const scaleButtonUp = () => {
      Animated.timing(animatedButtonScale, {
        toValue: 1,
        easing: Easing.bezier(0.38, 0.46, 0.08, 0.91),
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
          {joinedUsers.map((user, index) => {
            if (user.id !== socket.id) {
              return <JoinedUser key={index} userName={user.id} talking={user.talking}></JoinedUser>;
            }
          })}
        </View>

        <View style={pageStyles.pushToTalkCenterer}>
          <Animated.View style={[{ transform: [{ scale: animatedButtonScale }], position: 'relative' }, styles.fullCenter]}>
            <View style={pageStyles.pushToTalkBackground}></View>
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
      justifyContent: 'center',
    },

    pushToTalkBackground: {
      width: 164,
      height: 164,
      borderRadius: 82,
      backgroundColor: 'black',
      position: 'absolute',
    },

    pushToTalkbutton: {
      width: 160,
      height: 160,
      borderRadius: 80,
      backgroundColor: '#FF4848',
      borderWidth: 3,
      borderColor: 'white',
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
}