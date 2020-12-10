import React,{Component} from 'react';
import {Header, Badge,Icon, ListItem} from 'react-native-elements';
import {View,Text,Alert,StyleSheet, Animated, Dimensions, TouchableHighlight} from 'react-native';
import db from '../config'
import {SwipeListView} from 'react-native-swipe-list-view';
export default class SwipableFlatList extends Component{
constructor(props){
    super(props);
    this.state={
    allNotification:this.props.allNotification
    }
}
updateMarkAsRead=(notification)=>{
    db.collection("all_notification").doc(notification.doc_id).update({notification_status:"Read"})
}
onSwipeValueChange=(swipeData)=>{
var allNotification=this.state.allNotification
const {key,value}= swipeData
if(value<-Dimensions.get("window").width){
    const newData=[...allNotification]
    const prevIndex=allNotification.findIndex(item=>item.key===key);
    this.updateMarkAsRead(allNotification[prevIndex]);
    newData.splice(prevIndex,1);
    this.setState({allNotification:newData});
}
}
renderItem=(data)=>{
<Animated.View>
    <ListItem leftElement={<Icon name="book" type="font-awesome" color="#696969" ></Icon>} title={data.item.book_name} titleStyle={{color:"black", fontWeight:'bold'}} subtitle={data.item.message} bottomDivider>

    </ListItem>
</Animated.View>
}
renderHiddenItem=()=>(
    <View style={styles.rowBack}>
    <View style={[styles.backRightButton,styles.backRightButtonRight]}>
   <Text style={styles.backTextWhite}>
   
   </Text>
    </View>
    </View>
)
render(){
    return(
        <View style={styles.container}>
<SwipeListView disableRightSwipe data={this.state.allNotification} renderItem={this.renderItem} renderHiddenItem={this.renderHiddenItem} rightOpenValue={-Dimensions.get("window").width} previewRowKey="0" previewOpenValue={-40} previewOpenDelay={3000} onSwipeValueChange={this.onSwipeValueChange}>

</SwipeListView>
        </View>
    )
}
}
const styles=StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    backTextWhite: {
        color: '#FFF',
        fontWeight:'bold',
        fontSize:15
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#29b6f6',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightButton: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 100,
    },
    backRightButtonRight: {
        backgroundColor: '#29b6f6',
        right: 0,
    },
})