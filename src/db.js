import firebase from "firebase/app";
import "firebase/firestore";

// setup firebase
const firebaseConfig = {
  apiKey: "AIzaSyBhxGWUq61BPjBLX9OORxH8PlZqir5lsO4",
  authDomain: "scotland-yard-495ce.firebaseapp.com",
  //   databaseURL: "https://scotland-yard-495ce.firebaseio.com",
  projectId: "scotland-yard-495ce",
  //   messagingSenderId: "1000051458561",
  //   appId: "1:1000051458561:web:61dc3f10fe539e88c6f600",
  //   measurementId: "G-03ZWL7YNYQ",
  //   storageBucket: "scotland-yard-495ce.appspot.com",
};

export const db = firebase.initializeApp(firebaseConfig).firestore();
