// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDi6rszo3jNhmJmuNNCMzVNeP_heXnIJ2A",
  authDomain: "test-8b625.firebaseapp.com",
  projectId: "test-8b625",
  storageBucket: "test-8b625.appspot.com",
  messagingSenderId: "346602161855",
  appId: "1:346602161855:web:17ca49193499aeb318680a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app
