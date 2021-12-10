import React, {useState, createContext, useContext, useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
                console.log("CurrentTimeprev: " + CurrentTime)

            },
         10000)
    }
    CountDown()

    useEffect(() => {
        console.log("CurrentTim")
    })

    return (
      <View style={styles.container}>
        <Text style={styles.Text} >{CurrentTime}</Text>

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