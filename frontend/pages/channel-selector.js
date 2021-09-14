import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {PermissionsAndroid, StyleSheet, Text, View, Button} from 'react-native';
import styles from '../styles/misc';

export default function ChannelSelector(props) {
  const {navigate} = props.navigation;

  return (
    <View style={styles.container}>
      <Button
        title="Go to room"
        onPress={() => {
          navigate('Channel Room');
        }}></Button>
    </View>
  );
}

const pageStyles = StyleSheet.create({});
