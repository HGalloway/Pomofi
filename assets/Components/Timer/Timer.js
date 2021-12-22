import React, { useRef, useState, useEffect } from 'react'
import { AppState, StyleSheet, Text, View, Button } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const StoreValueInStorage = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value)
  } catch (e) {
    // saving error
  }
}

export default function Timer(props) {
  const [SecondsLeft, SetSecondsLeft] = useState()
  const [TimeFormatted, SetFormattedTime] = useState()
  const [IsTimerOn, SetIsTimerOn] = useState()
  const [TimeGoingIntoBackground, SetTimeGoingIntoBackground] = useState()

  useEffect(async () => {
    console.log("Setting Var")
    //Set State Variables
    SetSecondsLeft(props.Time)
    SetIsTimerOn(false)
    console.log(IsTimerOn)

    //Background/Foreground Handler
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    )
    return () => {
      subscription.remove()
    }
  }, [])

  const handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
      console.log('Foreground')
      CalculateDifferenceBetweenTimes()
    } 
    else if (nextAppState === 'inactive') {
      console.log('Background')
      SaveDiffrenceVariables()
   }
  }

  const SaveDiffrenceVariables = async () => {
    await AsyncStorage.setItem("BackgroundTime", JSON.stringify(Date.now()))
    await AsyncStorage.setItem("IsTimerOn", IsTimerOn)
    
  }

  var BackgroundTime;
  var TimerOn;

  function CalculateDifferenceBetweenTimes(){
    GetDifferenceVariables()
  }

  const GetDifferenceVariables = async () => {
    BackgroundTime = await AsyncStorage.getItem("BackgroundTime").then((Value) => {return Value})
    TimerOn = await AsyncStorage.getItem("Timer").then((Value) => {return Value})
    CurrentTime = Date.now() 
    console.log("TimerOn: " + TimerOn)
  }

  useEffect(() => {
    FormatSecondsLeft()
  }, [SecondsLeft])

  var Hours
  var Minutes
  var Seconds
  function FormatSecondsLeft() {
    var dateObj = new Date(SecondsLeft * 1000)
    Hours = dateObj.getUTCHours()
    Minutes = dateObj.getUTCMinutes()
    Seconds = dateObj.getSeconds()
    CheckForSingleDigits()
    SetFormattedTime(
      Hours.toString() + ':' + Minutes.toString() + ':' + Seconds.toString(),
    )
  }

  function CheckForSingleDigits() {
    if (Hours.toString().length == 1) {
      Hours = '0' + Hours
    }
    if (Minutes.toString().length == 1) {
      Minutes = '0' + Minutes
    }
    if (Seconds.toString().length == 1) {
      Seconds = '0' + Seconds
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
    SetSecondsLeft(() => {
      if (SecondsLeft > 0) return SecondsLeft - 1
      else return 0
    })
  }

  return (
    <View style={styles.container}>
      <Text>Time: {SecondsLeft}</Text>
      {/* TimeFormatted */}
      <Button
        title="Start"
        onPress={() => {
          TurnTimerOnOrOff()
        }}
      />
    </View>
  )

  function TurnTimerOnOrOff() {
    if (IsTimerOn == true) {
      SetIsTimerOn(false)
    } else {
      SetIsTimerOn(true)
    }
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Text: {
    color: 'white',
  },
})
