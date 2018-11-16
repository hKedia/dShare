import firebase from "firebase/app";
import "firebase/database";

const config = {
  apiKey: "AIzaSyD2fNf6h3tgBrrnzJcVkVDG5Cno0q1z_xQ",
  authDomain: "file-share-812ba.firebaseapp.com",
  databaseURL: "https://file-share-812ba.firebaseio.com",
  projectId: "file-share-812ba",
  storageBucket: "file-share-812ba.appspot.com",
  messagingSenderId: "764387547212"
};

export default (!firebase.apps.length
  ? firebase.initializeApp(config)
  : firebase.app());
