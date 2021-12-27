import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Meditation({ navigation }) {
    return (
      <View id='MainView' style={styles.MainContainer}>
        <Text>Meditation</Text>
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
  