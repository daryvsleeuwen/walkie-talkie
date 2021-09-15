import React from 'react';
import {PermissionsAndroid, StyleSheet, Text, View, Button, Pressable} from 'react-native';
import styles from '../styles/misc';

export default function ChannelSelector(props) {
  const {navigate} = props.navigation;

  return (
    <View style={styles.container}>
    
      {/* General page title box */}
      <View style={styles.pageTitleBox}>
        <Text style={styles.pageTitle}>Select Channel</Text>
      </View>

      {/* General middle part of page */}
      <View style={styles.pageContent}>
        <View style={pageStyles.frequencySelectorBox}>
          <Text>FREQUENCY SELECTIONS HERE</Text>
        </View>
      </View>

      {/* Page call to action button */}
      <Pressable
        style={styles.button}
        onPress={() => {
          navigate('channel-room');
        }}>
        <Text style={styles.buttonText}>Join Channel</Text>
      </Pressable>
    </View>
  );
}

const pageStyles = StyleSheet.create({
  frequencySelectorBox: {
    width: '100%',
    height: 250,
    backgroundColor: 'grey',
    padding: 20,
  },
});
