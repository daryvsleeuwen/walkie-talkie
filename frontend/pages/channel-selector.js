import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {PermissionsAndroid, StyleSheet, Text, View, Button} from 'react-native';
import styles from '../styles/misc';

export default function ChannelSelector(props) {
  const {navigate, state} = props.navigation;

  return (
    <View style={styles.container}>
      <Text>Channel Selector</Text>
      <Button
        title="test"
        onPress={() => {
          navigate('ChannelRoom');
        }}></Button>
    </View>
  );
}

const pageStyles = StyleSheet.create({});
