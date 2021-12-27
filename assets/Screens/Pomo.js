import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Timer from '../Components/Timer/Timer'

export default function Pomo({ navigation }) {
    return (
      <View id='MainView' style={styles.MainContainer}>
        <Timer WorkTime="6" BreakTime="5"/>
      </View>
    );
}

  const styles = StyleSheet.create({
    MainContainer: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  