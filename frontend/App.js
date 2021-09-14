import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {Button, PermissionsAndroid, StyleSheet, Text, View} from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import ChannelSelector from './pages/channel-selector';
import ChannelRoom from './pages/channel-room';

const navigator = createStackNavigator({
  ChannelSelector: {screen: ChannelSelector},
  ChannelRoom: {screen: ChannelRoom},
})

const App = createAppContainer(navigator);
export default App;