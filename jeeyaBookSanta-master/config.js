import firebase from 'firebase';
require ('@firebase/firestore') 
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBmxc55FXJdhi-elGYutp0Fq55oRhsM7Ao",
  authDomain: "book-santa-d9b10.firebaseapp.com",
  databaseURL: "https://book-santa-d9b10.firebaseio.com",
  projectId: "book-santa-d9b10",
  storageBucket: "book-santa-d9b10.appspot.com",
  messagingSenderId: "232667385351",
  appId: "1:232667385351:web:ffdfd3cbd4c147da56e4a2"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export default firebase.firestore()