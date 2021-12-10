import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Timer from "./Timer"


export default function ProgressWheel(String) {
    return (
      <View style={styles.container}>
        <View id="OutsideCircle" style={styles.OutsideCircle}>
            <View id="ProgressBar" style={[styles.ProgressBar, {
                transform: [
                { rotateZ: "45deg" },
                ]
            }]}>
                
            </View>
            <Timer InitialTime="10.00"></Timer>
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "50%"
    },
    OutsideCircle: {
        width: 200,
        height: 200,
        borderRadius: 200 / 2,
        borderWidth: 30,
        borderColor: '#808080',
        justifyContent: 'center',
        alignItems: 'center'
      },
    ProgressBar: {
        width: 190,
        height: 190,
        borderRadius: 190 / 2,
        borderWidth: 15,
        position: 'absolute',
        borderLeftColor: '#FF9800',
        borderBottomColor: '#FF9800',
        borderRightColor: '#FF9800',
        borderTopColor: '#FF9800',
      },
  });