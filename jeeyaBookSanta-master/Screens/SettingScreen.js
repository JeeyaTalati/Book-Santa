import React,{Component} from 'react';
import {View, StyleSheet,Text,Image,TouchableOpacity,TextInput,Alert, Modal, ScrollView, KeyboardAvoidingView, FlatList} from 'react-native';
import db from '../config';
import {ListItem} from 'react-native-elements';
import firebase, { database } from 'firebase';
import MyHeader from '../Components/MyHeader';
export default class SettingScreen extends Component{
    constructor(){
        super();
        this.state={
            emailId:"",
            firstName:"",
            lastName:"",
            address:"",
            contact:"",
            docId:"",
        }
    
    }
    getUserDetails=()=>{
        var email=firebase.auth().currentUser.email;
        db.collection("users").where("email_id","==",email).get().then((snapshot)=>{
            snapshot.forEach((doc)=>{
                var data=doc.data();
                this .setState({
                    emailId:data.email_id,
                    firstName:data.first_name,
                    lastName :data.last_name,
                    contact:data.contact,
                    address:data.address,
                    docId:doc.id,
                })
            })
        })
    }
    updateUserDetails=()=>{
        db.collection("users").doc(this.state.docId).update({
            first_name:this.state.firstName,
                last_name:this.state.lastName,
                contact:this.state.contact,
                address:this.state.address,
        })
        Alert.alert("Profile Updated Succesfully");
    }
    componentDidMount(){
        this.getUserDetails();
    }
    render(){
        return(
            <View style={styles.container}>
          <MyHeader title="SETTINGS" navigation={this.props.navigation}>
           
           </MyHeader>
           <View style={styles.formContainer} >
           <TextInput style={styles.formTextInput} placeholder="First Name"  onChangeText={(text)=>{this.setState({firstName:text})}} maxLength={8} value={this.state.firstName}>
               
               </TextInput>
               <TextInput style={styles.formTextInput} placeholder="Last Name"  onChangeText={(text)=>{this.setState({lastName:text})}} maxLength={8} value={this.state.lastName}>
               
               </TextInput>
               <TextInput keyboardType={"numeric"} style={styles.formTextInput} placeholder="Contact Number"  onChangeText={(text)=>{this.setState({contact:text})}} maxLength={10} value={this.state.contact} >
               
               </TextInput>
               <TextInput style={styles.formTextInput} placeholder="Address"  onChangeText={(text)=>{this.setState({address:text})}} multiline={true} value={this.state.address}>
               
               </TextInput>
               <TouchableOpacity style={styles.button} onPress={()=>{this.updateUserDetails()}}>
                <Text style={styles.buttonText}>
                    SAVE
                </Text>
               </TouchableOpacity>
           </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        
        alignItems: 'center',
        justifyContent: 'center'
      },
      formContainer:{
        flex:1,
        
        alignItems:'center',
        width:"100%",
      },
      formTextInput:{
        width:"75%",
        height:35,
        alignSelf:'center',
        borderColor:'#ffab91',
        borderRadius:10,
        borderWidth:1,
        marginTop:20,
        padding:10
      },
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
        },
        shadowOpacity: 0.30,
        shadowRadius: 10.32,
        elevation: 16,
        padding: 10
      },
      buttonText:{
        color:'#ffff',
        fontWeight:'200',
        fontSize:20
      },
})