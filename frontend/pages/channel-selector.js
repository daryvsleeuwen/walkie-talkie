
import React from 'react';
import {PermissionsAndroid, StyleSheet, Text, View, Button} from 'react-native';
import styles from '../styles/misc';

export default function ChannelSelector(props) {
  const {navigate} = props.navigation;

  return (
    <View style={styles.container}>
      <View style={styles.pageTitleBox}>
        <Text style={styles.pageTitle}>Select Channel</Text>
      </View>
      <Button
        title="Join Channel"
        onPress={() => {
          navigate('channel-room');
        }}></Button>
    </View>
  );
}

const pageStyles = StyleSheet.create({});
