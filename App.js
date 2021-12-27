import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ProgressWheel from './assets/Components/ProgressWheel'
import Timer from './assets/Components/Timer/Timer';


export default function App() {
  return (
    <View style={styles.container}>
      <Timer Time="60"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
