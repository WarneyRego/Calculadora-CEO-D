import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBJxsUiJoaPG5tMAOZc-jbcXD_5WEfh4Sk",
  authDomain: "chat-app-c369c.firebaseapp.com",
  projectId: "chat-app-c369c",
  storageBucket: "chat-app-c369c.firebasestorage.app",
  messagingSenderId: "327100170517",
  appId: "1:327100170517:web:b942da44c08a662c81a91c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 