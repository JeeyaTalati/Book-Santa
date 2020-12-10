import React,{Component} from 'react';
import {Header, Badge,Icon} from 'react-native-elements';
import {View,Text,Alert,StyleSheet} from 'react-native';
import db from '../config'

export default class MyHeader extends Component{
constructor(){
    super();
    this.state={
        value:"",
    }
}
getNumberOfUnreadNotification(){
    db.collection("all_notifications").where("notification_status","==","unread").onSnapshot((snapShot)=>{
        var unreadNotification = snapShot.docs.map((doc)=>{doc.data()});
        this.setState({value:unreadNotification.length})
    })
}
componentDidMount(){
    this.getNumberOfUnreadNotification();
}
bellIconWithBadge=()=>{
return(
    <View>
        <Icon name="bell" type="font-awesome" color="#696969" size={25} onPress={()=>{this.props.navigation.navigate("Notifications")}}>
        
        </Icon>
        <Badge value={this.state.value} containerStyle={{position:"absolute",top:-4,right:-4}}>
         
        </Badge>
    </View>
)
}
render(){
    return(
        <Header leftComponent={<Icon name="bars" type="font-awesome" color="#696969" onPress={()=>this.props.navigation.toggleDrawer()} ></Icon>} centerComponent={{text:this.props.title,style:{color:"#90a5a9",fontWeight:'bold', fontSize:20}}} rightComponent={<this.bellIconWithBadge{...this.props}/>} backgroundColor="#eaf8fe">

        </Header>
    )
}
}