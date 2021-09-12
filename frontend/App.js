import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {Button, PermissionsAndroid, StyleSheet, Text, View} from 'react-native';

import ChannelSelector from './pages/channel-selector';
import ChannelRoom from './pages/channel-room';

export default function App() {
  return ChannelSelector();
}