import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import BookDonateScreen from '../Screens/BookDonateScreen';
import ReceiverDetailScreen from '../Screens/ReceiverDetailScreen';
export const AppStackNavigator= createStackNavigator({
    BookDonateList:{screen:BookDonateScreen,navigationOptions:{headerShown:false}},
    ReceiverDetails:{screen:ReceiverDetailScreen,navigationOptions:{headerShown:false}},
},
{
    initialRoute:"BookDonateList",
})