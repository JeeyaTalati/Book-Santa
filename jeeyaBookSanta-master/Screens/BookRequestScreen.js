import React,{Component} from 'react';
import {View, StyleSheet,Text,Image,TouchableOpacity,TextInput,Alert, Modal, ScrollView, KeyboardAvoidingView} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../Components/MyHeader';
import {BookSearch} from 'react-native-google-books';
import {SearchBar,ListItem} from 'react-native-elements';
import { FlatList, TouchableHighlight } from 'react-native-gesture-handler';
export default class BookRequestScreen extends Component{
    constructor(){
        super()
        this.state={
            userId:firebase.auth().currentUser.email,
            bookName:"",
            reason:"",
            isBookRequestActive:"",
            requestedBookName:"",
            bookStatus:"",
            requestId:"",
            userDocId:"",
            docId:"",
            imageName:"",
            dataSource:"",
            showFlatList: false,

        }
    }
    createUniqueId(){
        return Math.random().toString(36).substring(7)
    }
    addRequest= async (bookName,reason)=>{
      var userId=this.state.userId
      var randomRequestId=this.createUniqueId()
      var books = await BookSearch.searchBook(bookName,"AIzaSyBmxc55FXJdhi-elGYutp0Fq55oRhsM7Ao") 
      db.collection("requested_books").add({
          userId:userId,
          bookName:bookName,
          reason:reason,
          requestId:randomRequestId,
          bookStatus:"Requested",
          date:firebase.firestore.FieldValue.serverTimestamp(),
          imageLink:books.data[0].volumeInfo.imageLinks.smallThumbnail
      })
      await this.getBookRequest();
      db.collection("users").where("email_id","==",userId).get().then((snapShot)=>{
        snapShot.forEach((doc)=>{
          db.collection("users").doc(doc.id).update({isBookRequestActive:true});
        })
      })
      this.setState({
          bookName:"",
          reason:"",
          requestId:randomRequestId,
      })
      return(
          Alert.alert("Book Requested Succesfully")
      )
    }
    receivedBooks=(bookName)=>{
      var userId = this.state.userId;
      var requestId = this.state.requestId;
      db.collection("receivedBooks").add({
        userId:userId,
        bookName:bookName,
        requestId:requestId,
        bookStatus:"received",
      })
    }
    getIsBookRequestActive=()=>{
      db.collection("users").where("email_id","==",this.state.userId).onSnapshot((snapShot)=>{
        snapShot.forEach((doc)=>{
         this.setState({
           isBookRequestActive:doc.data().isBookRequestActive,
           userDocId:doc.id
         })
        })
      })
    }
    getBookRequest=()=>{
      var bookRequest=db.collection("requested_books").where("userId","==",this.state.userId).get().then((snapShot)=>{
        snapShot.forEach((doc)=>{
          if (doc.data().bookStatus!=="received"){
            this.setState({
              requestId:doc.data().requestId,
              requestedBookName:doc.data().bookName,
              bookStatus:doc.data().bookStatus,
              docId:doc.id
            })
          }
        })
      })
    }
componentDidMount(){
  this.getBookRequest();
  this.getIsBookRequestActive();
}
updateBookRequestStatus=()=>{
  db.collection("requested_books").doc(this.state.docId).update({
    bookStatus:"received"
  })
  db.collection("users").where("email_id","==",this.state.userId).get().then((snapShot)=>{
    snapShot.forEach((doc)=>{
      db.collection("users").doc(doc.id).update({isBookRequestActive:false});
    })
  })
}
sendNotification=()=>{
  db.collection("users").where("email_id","==",this.state.userId).get().then((snapShot)=>{
    snapShot.forEach((doc)=>{
      var name=doc.data().first_name;
      var lastName = doc.data().last_name;
      db.collection("all_notifications").where("requestId","==",this.state.requestId).get().then((snapShot)=>{
        snapShot.forEach((doc)=>{
          var donarId = doc.data().donor_id;
          var bookName=doc.data().book_name;
          db.collection("all_notifications").add({
            "targeted_user_id"    : donarId,
           "book_name"           : bookName,
           "notification_status" : "unread",
           "message"             : name +" "+lastName+"received the book"+bookName
          })

        })
      })
    })
  })
}
async getBooksFromApi(bookName){
  this.setState({bookName:bookName})
  if(bookName.length>2){
    var books = await BookSearch.searchBook(bookName,"AIzaSyBmxc55FXJdhi-elGYutp0Fq55oRhsM7Ao")
    this.setState({
      dataSource:books.data,
      showFlatList:true,

    })
  }
  
}
renderItem=({item,i})=>{
return(
  <TouchableHighlight style={{alignItems:'center',backgroundColor:"#dddddd",padding:10,width:"90%"}} activeOpacity={0.6} underlayColor="#dddddd" onPress={()=>{
    this.setState({showFlatList:false,bookName:item.volumeInfo.title})
  }} bottomDivider>
  <Text>
    {item.volumeInfo.title}
  </Text>
  </TouchableHighlight>
)
}
    render(){
      if(this.state.isBookRequestActive===true){
        return(
          <View style={{flex:1, justifyContent:'center'}}>
           <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
             <Text>
               Book Name
             </Text>
             <Text>
               {this.state.requestedBookName}
             </Text>
           </View>
           <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
             <Text>
               Book Status
             </Text>
             <Text>
               {this.state.bookStatus}
             </Text>
           </View>
           <TouchableOpacity style={{borderWidth:1,
          borderColor:"orange",
          backgroundColor:"orange",
          width:300,
          alignSelf:'center',
          alignItems:'center',
          height:30,
          marginTop:30}} onPress={()=>{this.sendNotification()
          this.updateBookRequestStatus() 
          this.receivedBooks(this.state.requestedBookName) }}>
             <Text>
               I Received The Book
             </Text>
           </TouchableOpacity>
          </View>
        )
      }
      else{

      
        return(
            <View style={{flex:1}}>
              <MyHeader title="Request Book" navigation ={this.props.navigation}/>
                <KeyboardAvoidingView style={styles.keyBoardStyle}>
                  <TextInput
                    style ={styles.formTextInput}
                    placeholder={"enter book name"}
                    onChangeText={(text)=>{
                        this.getBooksFromApi(text)
                    }}
                    onClear={(text)=>{this.getBooksFromApi("")}}
                    value={this.state.bookName}
                  />
                  {
                    this.state.showFlatList?(
                      <FlatList data={this.state.dataSource} renderItem={this.renderItem} enableEmptySections={true} style={{marginTop:10}} keyExtractor={(item,index)=>{index.toString()}}>
                   
                      </FlatList>
                    ):
                    
                  (
                    <View>
                  <TextInput
                    style ={[styles.formTextInput,{height:300}]}
                    multiline
                    numberOfLines ={8}
                    placeholder={"Why do you need the book"}
                    onChangeText ={(text)=>{
                        this.setState({
                            reason:text
                        })
                    }}
                    value ={this.state.reason}
                  />
                  <TouchableOpacity
                    style={styles.button}
                    onPress={()=>{this.addRequest(this.state.bookName,this.state.reason)}}
                    >
                    <Text>Request</Text>
                  </TouchableOpacity>
                  </View>
                  )}
                </KeyboardAvoidingView>
            </View>
        )
      }
    }
  }
    
    const styles = StyleSheet.create({
      keyBoardStyle : {
        flex:1,
        alignItems:'center',
        justifyContent:'center'
      },
      formTextInput:{
        width:"75%",
        height:35,
        alignSelf:'center',
        borderColor:'#ffab91',
        borderRadius:10,
        borderWidth:1,
        marginTop:20,
        padding:10,
      },
      button:{
        width:"75%",
        height:50,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        backgroundColor:"#ff5722",
        shadowColor: "#000",
        shadowOffset: {
           width: 0,
           height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
        elevation: 16,
        marginTop:20
        },
      }
    )