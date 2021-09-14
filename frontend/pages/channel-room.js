import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {PermissionsAndroid, StyleSheet, Text, View} from 'react-native';
import LiveAudioStream from 'react-native-live-audio-stream';
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
  return (
    <View style={styles.container}></View>
  );
}

const pageStyles = StyleSheet.create({});
