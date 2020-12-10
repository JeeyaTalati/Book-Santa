import BookDonateScreen from '../Screens/BookDonateScreen';
import BookRequestScreen from '../Screens/BookRequestScreen';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {AppStackNavigator} from './AppStackNavigator';
import {Image} from 'react-native';
import {React} from 'react';
 const AppTabNavigator = createBottomTabNavigator({
    DonateBooks:{screen:AppStackNavigator, 
    navigationOptions:{
        
        tabBarLabel:"Donate Books"}
    },
    RequestBooks:{screen:BookRequestScreen, 
    navigationOptions:{
        
        tabBarLabel:"Read Books"}
    },
})
export default AppTabNavigator