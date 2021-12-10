import React, {useState, createContext, useContext} from 'react';
import { StyleSheet, Text, View } from 'react-native';

var CurrentTimeBeforeWipe = CurrentTime


export default function Timer({InitialTime}) {
    const [CurrentTime, setCurrentTime] = useState(InitialTime)
    var CurrentTimeSplit = CurrentTime.toString().split(".")
    // console.log("Split Init: " + CurrentTimeSplit)
    const [CurrentTimeFormatted, setCurrentTimeFormatted] = useState(CurrentTimeSplit[0] + ":" + CurrentTimeSplit[1])
    // console.log("Current Time Formatted Init: " + CurrentTimeFormatted)

    function CountDown() {         
        setTimeout(
            function() {
                CurrentTimeSplit = CurrentTime.toString().split(".")
                if (CurrentTimeSplit[1] == "00"){
                    setCurrentTime(0.0 + ((CurrentTimeSplit[0] - 1) + .59))
                    
                }
                else {
                    setCurrentTime(CurrentTimeSplit[0] + "." +(CurrentTimeSplit[1] - 1))
                }
                if (CurrentTime > 0.0) {
                    //Set New CurrentTime
                    CountDown();
                }
                console.log("CurrentTime: " + CurrentTime)
                
                console.log("CurrentTimePrev: " + CurrentTimeBeforeWipe)
            },
         10000)
    }
    CountDown()
    return (
      <View style={styles.container}>
        <Text style={styles.Text}>{CurrentTimeFormatted}</Text>
        <Text style={styles.Text}>Current Time: {CurrentTime}</Text>
        <Text style={styles.Text}>Current Time Split: {CurrentTimeSplit[0]} {CurrentTimeSplit[1]}</Text>

      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "50%",
        justifyContent: 'center',
        alignItems: 'center'
    },
    Text: {
        color: "white"
    }
  });