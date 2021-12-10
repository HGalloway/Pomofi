import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CircularProgress from "react-native-circular-progress-indicator"
import ProgressWheel from './assets/Components/ProgressWheel';

export default function App() {
  return (
    <View style={styles.container}>
      <ProgressWheel>
        
      </ProgressWheel>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
