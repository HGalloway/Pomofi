import React, { useRef, useState, useEffect } from 'react'
import { AppState, StyleSheet, Text, View } from 'react-native'
import Button from 'react-native-button'
import * as SQLite from 'expo-sqlite';
import PercentageCircle from '@ikonintegration/react-native-percentage-circle';

const TimerSettingsDatabase = SQLite.openDatabase("TimerSettings");

TimerSettingsDatabase.transaction(tx => {
  tx.executeSql(
    "drop table TimerSettings"
  );
  tx.executeSql(
    "create table if not exists TimerSettings (Setting varchar(65535), Value varchar(65535))",
  );
})

var FreshUpdate = false

export default function Timer(props) {
  const [SecondsLeft, SetSecondsLeft] = useState()
  const [IsTimerOn, SetIsTimerOn] = useState()
  const [ButtonText, SetButtonText] = useState("Start")
  const [BreakOrWorkTime, SetBreakOrWorkTime] = useState("Work")

  

  useEffect(async () => {
    console.log("Setting Var")
    //Set State Variables
    SetSecondsLeft(props.WorkTime)
    SetIsTimerOn(false)

    //Set Settings in database
    TimerSettingsDatabase.transaction(tx => {
      tx.executeSql(
        "insert into TimerSettings (Setting, Value) values ('IsTimerOn', 'false')",
      );
      tx.executeSql(
        "insert into TimerSettings (Setting, Value) values ('BackgroundTime', '')",
      );
      tx.executeSql(
        "insert into TimerSettings (Setting, Value) values ('SecondsLeft', '" + props.Time + "')",
      );
    }, (error) => {console.log("Fail: " + error)})

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
      
      TimerSettingsDatabase.transaction(tx => {
        tx.executeSql(
          "select * from TimerSettings",
          [],
          (t, Output) => {
            UpdateTime(Output)
          },
          (t, Error) => {console.log("Fail: " + Error)}
        )
      })
    } 
    else if (nextAppState === 'inactive') {
      console.log('Background')
      
      TimerSettingsDatabase.transaction(tx => {
        tx.executeSql("UPDATE TimerSettings SET Value='" + Date.now() + "' WHERE Setting='BackgroundTime'",)
      })
   }
  }
 
  function UpdateTime(SQLOutput) {
    var TimerOn = JSON.parse(Object.values(SQLOutput.rows.item(0))[1])
    var BackgroundTime = Object.values(SQLOutput.rows.item(1))[1]
    var SecondsLeftBeforeBackgrounded = Object.values(SQLOutput.rows.item(2))[1]
    var SecondsDifference = Math.floor((Date.now() - BackgroundTime)/1000)
    
    if (TimerOn == true) {
      var SecondsDifference = Math.floor((Date.now() - BackgroundTime)/1000)
      var SecondsLeftAfterDiffy = SecondsLeftBeforeBackgrounded - SecondsDifference
      console.log("Seconds Difference: " + SecondsDifference)
      console.log("SecondsLeft: " + SecondsLeftAfterDiffy)
      SetSecondsLeft(() => {
        if (SecondsLeftAfterDiffy > 0) return SecondsLeftAfterDiffy
        else {
          if (BreakOrWorkTime == "Work") {
            SetBreakOrWorkTime("Break")
            return props.BreakTime
          }
          else if (BreakOrWorkTime == "Break"){
            SetBreakOrWorkTime("Work")
            return props.WorkTime
          }
        }
      })      
      FreshUpdate = true
      console.log("Finished Updating Time From Background")
    }
  }

  useEffect(() => {
    setTimeout(() => {
      CountDown()
    }, 1000)
  })

  function CountDown() {
    if (FreshUpdate == false){
      if (IsTimerOn == true){
        SetSecondsLeft(() => {
          if (SecondsLeft > 0) return SecondsLeft - 1
          else {
            if (BreakOrWorkTime == "Work") {
              SetBreakOrWorkTime("Break")
              return props.BreakTime
            }
            else if (BreakOrWorkTime == "Break"){
              SetBreakOrWorkTime("Work")
              return props.WorkTime
            }
          }
        })
      }
    }
    else{
      FreshUpdate = false
    }
  }

  useEffect(() => {
    TimerSettingsDatabase.transaction(tx => {
      tx.executeSql("UPDATE TimerSettings SET Value='" + SecondsLeft + "' WHERE Setting='SecondsLeft'",)
    })
  }, [SecondsLeft])

  function CurrentPercentage() {
    if (BreakOrWorkTime == "Work") {
      return (100 * SecondsLeft) / props.WorkTime
    }
    else if (BreakOrWorkTime == "Break"){
      return (100 * SecondsLeft) / props.BreakTime
    }
  }

  var Hours
  var Minutes
  var Seconds
  function FormatTime(SecondsLeft) {
    var dateObj = new Date(SecondsLeft * 1000)
    Hours = dateObj.getUTCHours()
    Minutes = dateObj.getUTCMinutes()
    Seconds = dateObj.getSeconds()
    CheckForSingleDigits()
    return Hours.toString() + ':' + Minutes.toString() + ':' + Seconds.toString()
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

  return (
    <View style={styles.container}>
      <View id="ProgressCircleAndTimerContainer" style={styles.ProgressCircleAndTimerContainer}>
        <PercentageCircle radius={150} percent={CurrentPercentage()} color={"#FFCAF2"} shadowColor={"#660066"} borderWidth={20} style={styles.ProgressWheel}>
          <View style={{alignItems: 'center'}}>
            <Text id="Title" style={styles.Title} allowFontScaling={false}>{BreakOrWorkTime}</Text>
            <Text id="Time" style={styles.Time} allowFontScaling={false}>{FormatTime(SecondsLeft)}</Text>
          </View>
        </PercentageCircle>  
      </View>
      
      <View id="StartPauseButtonContainer" style={styles.StartPauseButtonContainer}>
        <Button id="StartPauseButton" allowFontScaling={false} style={styles.StartPauseButton} color="#000000" onPress={() => { TurnTimerOnOrOff() }}>
          {ButtonText}
        </Button>
      </View>
    </View>
  )

  function TurnTimerOnOrOff() {
    if (IsTimerOn == true) {
      SetIsTimerOn(false)
      SetButtonText("Start")
      TimerSettingsDatabase.transaction(tx => {
        tx.executeSql(
          "UPDATE TimerSettings SET Value='false' WHERE Setting='IsTimerOn'",
        )
      })
    } 
    else {
      SetIsTimerOn(true)
      SetButtonText("Pause")
      TimerSettingsDatabase.transaction(tx => {
        tx.executeSql(
          "UPDATE TimerSettings SET Value='true' WHERE Setting='IsTimerOn'",
        )
      })
    }
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: "space-evenly",
    alignItems: 'center',
  },
  ProgressCircleAndTimerContainer: {
    alignItems: 'center',
    flex: 2,
    margin: 40,
  },
  ProgressWheel: {
    alignItems: 'center',
    borderWidth: 30,
  },
  Title: {
    fontSize: 50,
    position: 'absolute',
    flex: 0,
    margin: -60
  }, 
  Time: {
    fontSize: 40,
    position: 'absolute',
    flex: 0,
    margin: 20
  },  
  StartPauseButtonContainer: {
    alignItems: 'center',
    flex: 1,
    borderColor: "#ffff",
    margin: 40,
  },
  StartPauseButton: {
    fontSize: 40,
    backgroundColor: "#FFCAF2",
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    paddingRight: 30,
    paddingLeft: 30,
    marginTop: -100,
    overflow: "hidden",
    // fontFamily: "Comic",
  },
})