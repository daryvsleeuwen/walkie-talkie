import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {io} from 'socket.io-client';
import ChannelSelector from './pages/channel-selector';
import ChannelRoom from './pages/channel-room';
import Login from './pages/login';

const Stack = createNativeStackNavigator();

const headerOptions = {
  headerShown: false
};

let socket = io('http://192.168.178.23:8000');

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={headerOptions}>
        <Stack.Screen name="channel-selector" component={ChannelSelector} options={{title: "Select Channel"}} initialParams={{socket: socket}}/>
        <Stack.Screen name="channel-room" component={ChannelRoom} options={{title: "Channel"}} initialParams={{socket: socket}}/>
        <Stack.Screen name="login" component={Login} options={{title: "Login"}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
