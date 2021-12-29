import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Timer from '../Components/Timer/Timer'
import Evening from '../Backgrounds/Evening.svg'


export default function Pomo({ navigation }) {
    return (
      <View id='MainView' style={styles.MainContainer}>
          
          <Evening width="100%" height="100%" viewBox={`0 0 366 658`} preserveAspectRatio="xMinYMin slice" >
            
          </Evening>
          <Timer WorkTime={10} BreakTime={5}/>
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
  