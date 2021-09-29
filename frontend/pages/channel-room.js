import React from 'react';
import { useEffect } from 'react';
import LiveAudioStream from 'react-native-live-audio-stream';
import BackNavigation from '../components/back-navigator';
import { Animated, PermissionsAndroid, StyleSheet, Text, View, Pressable, Easing } from 'react-native';
import 'react-native-url-polyfill/auto';
import JoinedUser from '../components/joined-user';
import styles from '../styles/misc';
import RtcEngine from 'react-native-agora'

let engine;
let joined = false;
const options = {
  sampleRate: 16000,
  channels: 1,
  bitsPerSample: 16,
  audioSource: 6,
  bufferSize: 4096,
};

LiveAudioStream.init(options);

let agoraState = {
  appId: `973ff918e3064ce4ba5e71bac6d06267`,
  token: '006973ff918e3064ce4ba5e71bac6d06267IAAaIX36emN+3tm2X4W2dOelpjKEPSGi+zSzI0N69fWcc49auH4AAAAAEADy5cWPAHRVYQEAAQAAdFVh',
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
  let [joined, setJoined] = React.useState(false);
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

  if (joined != true) {
    socket.emit('join_room', roomid);
    setJoined(true);
  }

  socket.on('update_joined_users', (joinedUsers) => {
    if (mounted) {
      //setJoinedUsers(joinedUsers);
    }
  });

  socket.on('token_receiving', (token) => {
    RtcEngine.create(agoraState.appId).then(rtcEngine => {
      engine = rtcEngine;
      engine.enableAudio();
  
      engine.joinChannel(token, 'channel_' + roomid, null, 0);
  
      engine.setEnableSpeakerphone(true)
      engine.enableLocalAudio(true);
    })
  })

  const leaveRoom = () => {
    socket.emit('leave_room', roomid);
    engine.leaveChannel();
    joined = false;

  };

  const send = () => {
    socket.emit('set_talking_state', true);
    console.log(engine)
    engine.enableLocalAudio(true);
  };

  const stopSending = () => {
    socket.emit('set_talking_state', false);
    engine.enableLocalAudio(false);
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
