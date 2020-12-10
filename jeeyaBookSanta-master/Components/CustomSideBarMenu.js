import React,{Component} from 'react';
import {Header,Avatar} from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import db from '../config.js';
import {View,Text,Alert,StyleSheet,TouchableOpacity} from 'react-native';
import {DrawerItems} from 'react-navigation-drawer';
import firebase from 'firebase';
export default class CustomSideBarMenu extends Component{
    constructor(){
        super();
        this.state={
            userId:firebase.auth().currentUser.email,
            image:"#",
            name:"",
            docId:""
        }
    }
    selectPicture=async()=>{
        const {cancelled,uri}=await ImagePicker.launchImageLibraryAsync({
            mediaTypes:ImagePicker.MediaTypeOptions.All,
            allowsEditing:true,
            aspect:[4,3],
            quality:1,
        })
        if(!cancelled){
            this.uploadImage(uri,this.state.userId)
        }


    }
    uploadImage=async(uri,imageName)=>{
     var response=await fetch(uri)
     var blob = await response.blob()
     var ref=firebase.storage().ref().child("user_profile/"+ imageName)
     return ref.put(blob).then((response)=>{this.fetchImage(imageName)})
    }
    fetchImage=(imageName)=>{
        var ref=firebase.storage().ref().child("user_profile/"+imageName)
        ref.getDownloadURL().then((url)=>{
            this.setState({image:url});
        })
        .catch((error)=>{this.setState({image:"#"})});
    }
    getUserProfile(){
        db.collection("users").where("email_id","==",this.state.userId).onSnapshot((snapShot)=>{
            snapShot.forEach((doc)=>{
                this.setState({
                    name:doc.data().first_name+" "+doc.data().last_name,
                    docId:doc.id,
                    image:doc.data().image,
                })
            })
        })
    }
    componentDidMount(){
        this.getUserProfile()
        this.fetchImage(this.state.userId)

    }
render(){
    
    return(
        <View style={{flex:1}}>
            <View style={{flex:0.5,alignItems:'center',backgroundColor:"orange"}}>
                <Avatar rounded source={{uri:this.state.image}} size="medium" onPress={()=>{this.selectPicture()}} containerStyle={styles.imageContainer} showEditButton>
           
                </Avatar>
                <Text>
                    {this.state.name}
                </Text>
            </View>
        <View style={{flex:0.8}}>
        <DrawerItems
            {...this.props}>
        </DrawerItems>
        </View>
        <View style={{flex:0.2,justifyContent:"flex-end",paddingBottom:30}}>
        <TouchableOpacity style={{height:30,width:"100%",justifyContent:"center",padding:10}} onPress={()=>{this.props.navigation.navigate("WelcomeScreen")
    firebase.auth().signOut()}}>
       <Text>
           LOGOUT
       </Text>
        </TouchableOpacity>
        </View>
        </View>
    )
}
}
const styles=StyleSheet.create({
    imageContainer:{
        flex:0.75,
        width:"40%",
        height:"20%",
        marginLeft:20,
        marginTop:30,
        borderRadius:40,
    }
})
