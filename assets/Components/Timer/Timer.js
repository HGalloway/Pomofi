import React, { useRef, useState, useEffect } from 'react'
import { AppState, StyleSheet, Text, View } from 'react-native'
import Button from 'react-native-button'
import * as SVG from 'react-native-svg'
import * as SQLite from 'expo-sqlite';
import PercentageCircle from '@ikonintegration/react-native-percentage-circle';

const TimerSettingsDatabase = SQLite.openDatabase("TimerSettings");

TimerSettingsDatabase.transaction(tx => {
  tx.executeSql(
    "create table if not exists TimerSettings (Setting varchar(65535), Value varchar(65535))",
  );
  tx.executeSql(
    "delete from TimerSettings",
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
        "insert into TimerSettings (setting, value) values ('IsTimerOn', 'false')",
      );
      tx.executeSql(
        "insert into TimerSettings (setting, value) values ('BackgroundTime', '')",
      );
      tx.executeSql(
        "insert into TimerSettings (setting, value) values ('SecondsLeft', '" + props.Time + "')",
      );
    })

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
    
    console.log("Seconds Left Before Back: " + SecondsLeftBeforeBackgrounded)

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

  

  return (
    <View style={styles.container}>
      <PercentageCircle radius={150} percent={20} color={"#3498db"}>
        <Text id="Title" style={styles.Title} allowFontScaling={false}>{BreakOrWorkTime}</Text>
        <View style={{padding:20}}></View>
        <Text id="Time" style={styles.Time} allowFontScaling={false}>{SecondsLeft}</Text>
      </PercentageCircle>  
      
      <View id='Break' style={styles.Break}/>
      <Button 
        id="StartPauseButton"
        allowFontScaling={false}
        style={styles.StartPauseButton}
        onPress={() => {
          TurnTimerOnOrOff()
        }}
      >
        {ButtonText}
      </Button>
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
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Title: {
    fontSize: 50,
    position: 'absolute',
    flex: 0,
    padding: 20,

  }, 
  Time: {
    fontSize: 40,
    position: 'absolute',
    flex: 0,
    padding: 20,
  },  
  StartPauseButton: {
    fontSize: 40,
    borderColor: "rgb(0, 0, 0)",
    borderWidth: 2,
    borderRadius: 20,
    padding: 20,
  },
  Break: {
    padding: 50,
  }
})