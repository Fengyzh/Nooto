import './drawing.css';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import React from 'react'
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

export default function Drawing() {

    let {id} = useParams();


    const [state, setstate] = useState({
        Id: "",
        values: [{
        title: "New Section",
        value: "",
        edit: true
    }, 
    {
        title: "New Section",
        value:"",
        edit: true
    }

]})

    function handleAdd() {
        setstate({...state,values:[...state.values, {title: "New Section", value:"New Block", edit: true}]})
    }

    function handleChange(index, e) {
        const value = [...state.values]    //Spread the state into individual array elements
        value[index]["value"] = e.target.value  //Set the key named "value" in that index to the input
        setstate({...state,values:value}) //Update the state with the new state
        //console.log(state["values"][index])
        //console.log(state)

        
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";



    }

    function handleTitleChange(index, e) {
        const title = [...state.values]    
        title[index]["title"] = e.target.value  
        setstate({...state, values:title}) 
        //console.log(state[index])
        console.log(state)
    }

    function handleEdit(index) {
        const value = [...state.values]    
        value[index]["edit"] = !value[index]["edit"]
        setstate({...state, values:value})
        console.log(state)
    }

    function handleCloseAll() {
        const value = [...state.values]
        for (var i = 0; i < state.values.length; i++) {
            value[i]["edit"] = false
            setstate({values:value})
        }
    }


    function handleDelete(index) {
        console.log("index: " + index)
        const value = [...state.values]
        console.log(value)
        value.splice(index,1)
        setstate({...state, values: value})
        console.log(state)
        console.log(state.Id)
    }



    const handleSave = () => {
        console.log("saved...")
        console.log(state.Id)
        
        axios.post('/save', {
            id: state.Id,
            values: state.values,
         })
    }


    const handleScroll = (index) => {
       // Right now it will only scroll to the first element

        let boxes = document.getElementsByClassName("section-containers");
        console.log(boxes[index].getBoundingClientRect().top)
        console.log(boxes[1].getBoundingClientRect().top)
        //boxes[0].scrollIntoView({ behavior: 'smooth' })
       const y = boxes[index].getBoundingClientRect().top + window.pageYOffset - 30
        window.scrollTo({top:y, behavior: 'smooth'})
    }




    useEffect(() => {
        /*
        const text = document.querySelectorAll(".textarea");
        for (var i = 0; i < text.length; i++) {
        text[i].addEventListener("input", function (e) {
            this.style.height = "auto";
            this.style.height = this.scrollHeight + "px";
          });
        }*/




        axios.get(`posts/${id}`).then((res) => {
            if (res.data != 'Cannot find note') {
                setstate({Id:res.data._id,values:res.data.values})
    
                console.log(res.data)
            } 
        })

    }, [])
   



    return (
        <div className='container'>
        <div className='nav-panel'>
         
            {state.values.map((value, index)=>{
            return <div className='section-text' onClick={()=>{handleScroll(index)}}>{value.title}</div>
        })}

        </div>

        

        <div class="board">
       {state.Id?  <h3>ID is: {state.Id}</h3> : <h3>New Document</h3>}
       
        

            {state.values.map((st, index) => (
            <div key={index} className="section-containers">
                <input value={st.title} className="titles" onChange={(e) => handleTitleChange(index, e)}>
                
                </input>
                {console.log(st.edit)}
                {st.edit?
                <div>
                <textarea class="textarea" placeholder='Enter text here' value={st.value} onChange={(e) => handleChange(index, e)}>


                </textarea>
                <h1>{index}</h1>
                </div>
                : ""}
                <h1 className='markdown-title'>Markdown</h1>
                <div>
                    <ReactMarkdown children={st.value} className="results"/>
                
                </div>
                <button class="toggle-btn btn" onClick={() => handleEdit(index)}> Toggle Edit </button>
                <button class="delete-btn btn" onClick={() => handleDelete(index)}> Delete Section </button>

                {/*<input type="text" value={st.value} onChange={(e) => handleChange(index, e)}/>*/}
                
            </div>)) }
            
            <button onClick={handleAdd}>Add</button>
            <button onClick={handleCloseAll}>Close All Edit</button>
            <button onClick={handleSave}> Save </button>
            
           
            {/*<button onClick={handleScroll(0)}> scroll </button>*/}
            
            </div>
            </div>
    )
}
