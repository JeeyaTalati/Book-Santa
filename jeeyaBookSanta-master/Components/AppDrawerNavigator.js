import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import AppTabNavigator from './AppTabNavigator';
import CustomSideBarMenu from './CustomSideBarMenu';
import SettingScreen from '../Screens/SettingScreen';
import MyDonationScreen from '../Screens/MyDonationScreen';
import NotificationScreen from '../Screens/NotificationScreen';
export const AppDrawerNavigator = createDrawerNavigator({
    Home:{screen:AppTabNavigator},
    Settings:{screen:SettingScreen},
    MyDonations:{screen:MyDonationScreen},
    Notifications:{screen:NotificationScreen}
}, 
{contentComponent:CustomSideBarMenu},
{initialRouteName:"Home"},
)