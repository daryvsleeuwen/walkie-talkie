import React from 'react';
import {PermissionsAndroid, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import LiveAudioStream from 'react-native-live-audio-stream';
import Icon from 'react-native-ico-material-design';
import styles from '../styles/misc';

let record = () => {
  const options = {
    sampleRate: 32000,
    channels: 1,
    bitsPerSample: 16,
    audioSource: 6,
    bufferSize: 4096,
  };

  LiveAudioStream.init(options);
  LiveAudioStream.on('data', (data) => {
    console.log(data);
  });
  LiveAudioStream.start();
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

  return (
    <View style={styles.container}>
      <View style={styles.pageTitleBox}>
        <TouchableOpacity
          activeOpacity="0.8"
          style={{
            width: 40,
            height: 40,
            backgroundColor: '#FF4848',
          }}
          onPress={() => {
            navigate('channel-selector');
          }}>
          {/* <Icon
            style={{
              marginRight: 10,
            }}
            name="arrow_back"
            width="30"
            height="30"></Icon> */}
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Channel 107.3</Text>
      </View>
    </View>
  );
}

const pageStyles = StyleSheet.create({});
