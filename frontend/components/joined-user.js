import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import audioIcon from '../assets/icons/audio-wave.svg';

export default function JoinedUser(props) {
  let userTextStyling = props.talking ? [pageStyles.userText, pageStyles.talkingUserText] : pageStyles.userText;

  return (
    <View style={{flexDirection: 'row', marginBottom: 10}}>
      <SvgXml
        xml={audioIcon}
        style={{marginRight: 8}}
        color="red"
        width="25"
        height="25"></SvgXml>
      <Text style={userTextStyling}>
        {props.userName}
        {props.talking ? ' is now talking' : null}
      </Text>
    </View>
  );
}

const pageStyles = StyleSheet.create({
  userText: {
    fontSize: 16,
    color: '#272727',
    fontFamily: 'Poppins-Medium',
  },

  talkingUserText: {
    color: '#FF4848',
    flex: 1
  },
});
