import React from 'react';
import { StyleSheet, Text } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Settings from './assets/Screens/Settings';
import Pomo from './assets/Screens/Pomo'
import Meditation from './assets/Screens/Meditation'

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export default function App() {
  

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Pomo') {
            iconName = "timer-outline";
          } 
          else if (route.name === 'Meditation') {
            iconName = "rose-outline";
          }
          else if (route.name === 'Settings') {
            iconName = "settings-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'pink',
        tabBarInactiveTintColor: 'gray',
        headerShown: false, 
        tabBarAllowFontScaling: false,
      })}>
        <Tab.Screen name="Pomo" component={Pomo}/>
        <Tab.Screen name="Meditation" component={Meditation}/>
        <Tab.Screen name="Settings" component={Settings}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

let Styles = StyleSheet.create({
  TabNavigation: {
    position: 'absolute',
    left: 10,
    right: 10,
    top: 20,
    bottom: 25,
    elevation: 0,
    borderRadius: 20,
    backgroundColor: "rgb(220,220,220)"
  }
})