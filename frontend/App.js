import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {io} from 'socket.io-client';
import ChannelSelector from './pages/channel-selector';
import ChannelRoom from './pages/channel-room';

const Stack = createNativeStackNavigator();

const headerOptions = {
  headerShown: false
}

let socket = io("https://walkietalkie-backend.herokuapp.com");

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={headerOptions}>
        <Stack.Screen name="channel-selector" component={ChannelSelector} options={{title: "Select Channel"}} initialParams={{socket: socket}}/>
        <Stack.Screen name="channel-room" component={ChannelRoom} options={{title: "Channel"}} initialParams={{socket: socket}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
