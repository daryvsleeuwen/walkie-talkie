import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { io } from "socket.io-client"

export default function App() {
  const socket = io("http://localhost:8000/");

  return (
    <View>
    </View>
  );
}

const styles = StyleSheet.create({});
