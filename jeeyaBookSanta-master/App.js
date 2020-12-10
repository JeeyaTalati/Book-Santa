import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import WelcomeScreen from "./Screens/WelcomeScreen";
import AppTabNavigator from "./Components/AppTabNavigator";
import {createSwitchNavigator,createAppContainer} from 'react-navigation';
import {AppDrawerNavigator} from './Components/AppDrawerNavigator';
export default function App() {
  return (
   <Appcontainer></Appcontainer>
  );
}
const SwitchNavigator=createSwitchNavigator({
  WelcomeScreen:{screen:WelcomeScreen},
  Drawer:{screen:AppDrawerNavigator}
});
const Appcontainer=createAppContainer(SwitchNavigator);

