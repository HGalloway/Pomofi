import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Settings({ navigation }) {
    return (
      <View id='MainView' style={styles.MainContainer}>
          <Text>Settings</Text>
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
  