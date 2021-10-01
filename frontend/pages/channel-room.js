import React from 'react';
import { useEffect } from 'react';
import BackNavigation from '../components/back-navigator';
import { Animated, StyleSheet, Text, View, Pressable, Easing } from 'react-native';
import 'react-native-url-polyfill/auto';
import JoinedUser from '../components/joined-user';
import styles from '../styles/misc';
import RtcEngine from 'react-native-agora';

let engine;
let joined = false;
let agoraState = {
  appId: `973ff918e3064ce4ba5e71bac6d06267`,
  token:
    '006973ff918e3064ce4ba5e71bac6d06267IAA/XzetnRRMMYDjQzculkCfz/DNLT7LfHZn5+2dhh0dddS2G+8AAAAAEADy5cWPOA9YYQEAAQA3D1hh',
  channelName: 'testing',
  openMicrophone: true,
  enableSpeakerphone: true,
  joinSucceed: false,
  peerIds: [],
};

export default function ChannelRoom(props) {
  const { navigate } = props.navigation;
  let { roomid, frequency, socket } = props.route.params;
  let [joinedUsers, setJoinedUsers] = React.useState([]);
  let [joined, setJoined] = React.useState(false);
  let [mounted, setMounted] = React.useState(false);
  const animatedButtonScale = React.useRef(new Animated.Value(1)).current;
  const animationSettings = {
    duration: 300,
    easing: Easing.bezier(0.38, 0.46, 0.08, 0.91),
    useNativeDriver: true,
  };

  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    }
  }, []);

  let send = () => {
    socket.emit('set_talking_state', true);
    engine.enableLocalAudio(true);
  };
  let stopSending = () => {
    socket.emit('set_talking_state', false);
    engine.enableLocalAudio(false);
  };

  socket.on('update_joined_users', (joinedUsers) => {
    console.log(joinedUsers)
    if (mounted) {
      setJoinedUsers(joinedUsers);
    }
  });

  if (!joined) {
    socket.emit('join_room', roomid);
    setJoined(true);

    socket.on('token_receiving', (token) => {
      RtcEngine.create(agoraState.appId).then((rtcEngine) => {
        engine = rtcEngine;
        engine.enableAudio();
        engine.joinChannel(agoraState.token, 'channel_' + roomid, null, 0);

        engine.setEnableSpeakerphone(true);
        engine.enableLocalAudio(false);
      });
    });
  }

  const leaveRoom = () => {
    console.log('leaving room ' + roomid)
    socket.emit('leave_room', roomid);

    if (engine) {
      engine.leaveChannel();
    }
    joined = false;
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
              Animated.timing(animatedButtonScale, { ...animationSettings, toValue: 0.8 }).start();
              send();
            }}
            onPressOut={() => {
              Animated.timing(animatedButtonScale, { ...animationSettings, toValue: 1 }).start();
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
