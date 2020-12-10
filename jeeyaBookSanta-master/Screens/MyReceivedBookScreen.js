import React ,{Component} from 'react'
import {View, Text,TouchableOpacity,ScrollView,FlatList,StyleSheet} from 'react-native';
import {Card,Icon,ListItem} from 'react-native-elements'
import MyHeader from '../components/MyHeader.js'
import firebase from 'firebase';
import db from '../config.js';
export default class MyReceivedBookScreen extends Component{
    constructor(){
        super()
        this.state = {
          userId : firebase.auth().currentUser.email,
          receivedBooksList : []
        }
        this.requestRef= null
      }
      getReceivedBooksList =()=>{
        this.requestRef = db.collection("requested_books").where("user_id" ,'==', this.state.userId).where("book_status", "==","received")
        .onSnapshot((snapshot)=>{
            var receivedBooksList=snapshot.docs.map(document=>document.data());
            this.setState({receivedBooksList:receivedBooksList});
         
        })
      }
      componentDidMount(){
        this.getReceivedBooksList()
    }
    componentWillUnmount(){
        this.requestRef=null;
    }
    keyExtractor=(item,index)=>{
        index.toString()
    }
    renderItem=({item,i})=>{
    return(
        <ListItem key={i} title={item.bookName} subTitle={item.book_status}titleStyle={{color:"black",fontWeight:'bold'}}  bottomDivider>
           
        </ListItem>
    )
    }
    render(){
        return(
          <View style={{flex:1}}>
            <View style={{flex:0.1}}>
              <MyHeader title={"Received Books"} navigation={this.props.navigation}/>
            </View>
            <View style={{flex:0.9}}>
              {
                this.state.receivedBooksList.length === 0
                ?(
                  <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <Text style={{fontSize:25}}>List Of All Received Books</Text>
                  </View>
                )
                :(
                  <FlatList
                    keyExtractor={this.keyExtractor()}
                    data={this.state.receivedBooksList}
                    renderItem={this.renderItem}
                  />
                )
              }
            </View>
          </View>
        )
      }
    }
    
    
    

