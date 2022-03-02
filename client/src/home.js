import React from 'react'
import { useState, useEffect } from 'react';


export default function Home() {
    const [title, setTitle] = useState({});

    async function getStuff() {
      await fetch('/title').then(res => res.json())
      .then(titles => setTitle(titles))  
    }

  
  
    useEffect(() => {
  
      //fetch('http://localhost:5000/title').then(response => response.json()).then(result => setTitle(result))
      //fetch('http://localhost:5000/title', { mode: 'no-cors',   credentials: 'omit'  }).then(response => console.log(response.json()), )
      
      getStuff()

    }, []);

    console.log(title)



    return (
        <div>
             <header className="App-header">
    
        <p>
         Home Page
        </p>
        <p>
            {title.text}
        </p>
      </header>
        </div>
    )
}
