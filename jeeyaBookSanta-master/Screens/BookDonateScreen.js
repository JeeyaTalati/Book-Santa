import React,{Component} from 'react';
import {View, StyleSheet,Text,Image,TouchableOpacity,TextInput,Alert, Modal, ScrollView, KeyboardAvoidingView, FlatList} from 'react-native';
import db from '../config';
import {ListItem} from 'react-native-elements';
import firebase, { database } from 'firebase';
import MyHeader from '../Components/MyHeader';
export default class BookDonateScreen extends Component{
constructor(){
    super();
    this.state={
        requestedBooksList:[],
        
    }
    this.requestRef=null;
}
getRequestedBooksList=()=>{
    this.requestRef=db.collection("requested_books")
    .onSnapshot((snapshot)=>{
        var requestedBooksList=snapshot.docs.map(document=>document.data());
        this.setState({requestedBooksList:requestedBooksList});
    })
}
componentDidMount(){
    this.getRequestedBooksList()
}
componentWillUnmount(){
    this.requestRef=null;
}
keyExtractor=(item,index)=>{
    index.toString()
}
renderItem=({item,i})=>{
return(
    <ListItem key={i} title={item.bookName} leftElement={<Image style={{height:50,width:50}} source={{uri:item.imageLink}}></Image>} subTitle={item.reason}titleStyle={{color:"black",fontWeight:'bold'}} rightElement={<TouchableOpacity style={styles.button} onPress={()=>{this.props.navigation.navigate("ReceiverDetail",{"details": item})}}><Text style={{color:"white"}}>VIEW</Text></TouchableOpacity>} bottomDivider>
       
    </ListItem>
)
}
render(){
    return(
        <View style={{flex:1}}>
          <MyHeader title="DONATE BOOKS" navigation={this.props.navigation}>
           
          </MyHeader>
          <View style={{flex:1}}>
             {
                 this.state.requestedBooksList.length===0?(
                     <View style={styles.subContainer}>
                         <Text style={{fontSize:20}}>
                          LIST OF ALL REQUESTED BOOKS
                         </Text>
                         
                     </View>

                 ):
                 (
                     <FlatList keyExtractor={this.keyExtractor} data={this.state.requestedBooksList} renderItem={this.renderItem}>

                     </FlatList>
                 )
             }
          </View>
        </View>
    )
}
}
const styles= StyleSheet.create({
    button:{
        width:300,
        height:50,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:25,
        backgroundColor:"#ff9800",
        shadowColor: "#000",
        shadowOffset: {
           width: 0,
           height: 8,
        }},
        subContainer:{
            flex:1,
            fontSize:20,
            justifyContent:'center',
            alignItems:'center',
        }

})