import './App.css';
import { useState, useEffect } from 'react';
import { fetchStuff } from './utils';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './home';
import Login from './login'
import Profile from './profile';
import axios from 'axios';
import { userContext } from './userContext';
import Drawing from './drawing';
import HomePage from './compoents/HomePage';
import Registration from './compoents/registration';
import { AuthContext } from './AuthContext';
import ProtectedRoute from './compoents/ProtectedRoute';



function App() {

  const [auth, setauth] = useState(false)
  
  //const [title, setTitle] = useState({});



  async function getStuff() {
    /*
    await fetch('/auth').then(res => res.json())
    .then(titles => setauth(titles))
*/
    axios.get('/auth').then(res => setauth(res.data.auth))
    

  }


  useEffect(() => {

    //fetch('http://localhost:5000/title').then(response => response.json()).then(result => setTitle(result))
    //fetch('http://localhost:5000/title', { mode: 'no-cors',   credentials: 'omit'  }).then(response => console.log(response.json()), )
    
    getStuff()
    //console.log(title)
  }, []);
  







  return (

    <Router>
   
   {/*  The <Switch> is not changed to <Routes> for React-router-dom v6 */}   
   <AuthContext> 
    <Routes>

   {/*  No more "exact" attribute and "compoent" attribute is now called "element" 
   Also notice the thing inside the {} is different now, its a tag instead of just
   the name*/}
     
         {console.log("Auth: " + auth)}
  
    <Route path='/' element={<HomePage/>} />
    <Route path="/doc/:id" element={<Drawing/>} />
    <Route path="/login" element={<Login isAuth={auth}/>}/>
    <Route path="reg" element={<Registration/>}/>
    
    <Route path="/profile" element={
      <ProtectedRoute>
        <Profile/>
      </ProtectedRoute>
    } />
   

  </Routes>
  </AuthContext> 
    </Router>
  );
}

export default App;
