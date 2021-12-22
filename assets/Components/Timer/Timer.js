import React, {useRef, useState, useEffect} from 'react';
import { AppState, StyleSheet, Text, View, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StoreValueInStorage = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value)
  } 
  catch (e) {
    // saving error
  }
}

export default function Timer(props) {
  const appState = useRef(AppState.currentState);
  const [SecondsLeft, SetSecondsLeft] = useState()
  const [TimeFormatted, SetFormattedTime] = useState()
  const [IsTimerOn, SetIsTimerOn] = useState()

  useEffect(async () => {
    //Set State Variables
    SetSecondsLeft(props.Time)
    SetIsTimerOn(false)

    //Background/Foreground Handler
    const subscription = AppState.addEventListener("change", handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [])

  const handleAppStateChange = async (nextAppState) => {
    if (nextAppState === "active") {
      console.log("Coming back babwe")

      setTimeout(async () => {
        //Calculate difference between TimeGoingIntoBackground and currenttime
        var TimeGoingIntoBackground = await AsyncStorage.getItem("TimeGoingIntoBackground").then((Values) => { return Values })
        var Difference = Date.now() - Number.parseInt(TimeGoingIntoBackground)
        if (IsTimerOn == true){
          console.log("EatAss")
          SetSecondsLeft(() => {
            if (SecondsLeft - Difference <= 0) return 0;
            else return SecondsLeft - Difference;
          }) //Check if this goes over 0 into negative numbers.
        }
      }, 3000)
      
    }

    else if (nextAppState === "inactive") {
      console.log("Background")
      StoreValueInStorage("TimeGoingIntoBackground", JSON.stringify(Date.now()))
    }
  }

  useEffect(() =>{
    console.log("SecondsLeft: " + SecondsLeft)
    FormatSecondsLeft()
  }, [SecondsLeft])
  
  var Hours 
  var Minutes
  var Seconds
  function FormatSecondsLeft() {
    var dateObj = new Date(SecondsLeft * 1000);
    Hours = dateObj.getUTCHours();
    Minutes = dateObj.getUTCMinutes();
    Seconds = dateObj.getSeconds();
    CheckForSingleDigits()
    SetFormattedTime(Hours.toString() + ":" + Minutes.toString() + ":" + Seconds.toString())
  }

  function CheckForSingleDigits() {
    if(Hours.toString().length == 1){
      Hours = "0" + Hours
    }
    if(Minutes.toString().length == 1){
      Minutes = "0" + Minutes
    }
    if(Seconds.toString().length == 1){
      Seconds = "0" + Seconds
    }
  }

  useEffect(() => {
    setTimeout(() => { 
      if (IsTimerOn == true) {
        CountDown()
      }
    }, 1000)
  })

  function CountDown() {
    SetSecondsLeft( () => {
      if (SecondsLeft > 0) return SecondsLeft - 1;
      else return 0
    })
  }

  return (
    <View style={styles.container}>
      <Text>Time:  {SecondsLeft}</Text>
      {/* TimeFormatted */}
      <Button title="Start" onPress={() => {TurnTimerOnOrOff()}}/>
    </View>
  );
  
  function TurnTimerOnOrOff() {
    if (IsTimerOn == true){
      SetIsTimerOn(false)
    }
    else{
      SetIsTimerOn(true)
    }
  }
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