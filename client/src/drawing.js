import './drawing.css';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import React from 'react'
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

export default function Drawing() {

    let {id} = useParams();

    const [panel, setPanel] = useState(false)

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

        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";

    }

    function handleEdit(index) {
        const value = [...state.values]    
        value[index]["edit"] = !value[index]["edit"]
        setstate({...state, values:value})
        console.log(state)


        /*
        let textField = document.getElementsByClassName("textarea")[index];
        let markdownField = document.getElementsByClassName("results")[index];
        console.log("text: ", markdownField)

        if (state.values[index].edit == false){
            textField.style.opacity = 0
            textField.style.display = "none"
            markdownField.style.display = "block"
        } else {
            textField.style.opacity = 1
            textField.style.display = "block"
            markdownField.style.display = "none"
        }
*/
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


    const retractPanel = () => {
        
        setPanel(!panel)
        let navPanel = document.getElementsByClassName("nav-panel")[0];
        let item = document.getElementsByClassName("section-text");
        let arrow = document.getElementsByClassName("panel-btn")[0];
        let board = document.getElementsByClassName("board")[0];


        let boolean = panel

        for (let i of item) {
            boolean? 
            i.style.display = "none" :
            i.style.display = "block"
        }

        if (boolean) {
            arrow.style.transform = "rotateY(0deg)"
            navPanel.style.padding = 0;
            navPanel.style.width = 0;
            navPanel.style.opacity = 0;
            navPanel.style.minWidth = "0"
            navPanel.style.transform = "translateX(-100px)"
        } else {
            arrow.style.transform = "rotateY(180deg)"
            navPanel.style.padding = "1rem";
            navPanel.style.width = "15%";
            navPanel.style.opacity = 100;
            navPanel.style.minWidth = "15%"
            navPanel.style.transform = "translateX(100px)"
        }
        
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
        let markdownFields = document.getElementsByClassName("results");
        let textFields = document.getElementsByClassName("textarea");



        axios.get(`posts/${id}`).then((res) => {
            if (res.data != 'Cannot find note') {
                setstate({Id:res.data._id,values:res.data.values})
                
                console.log(res.data)
            } 
        }).then(()=>{
            for (let i = 0; i < state.values.length; i++) {

                if (state.values[i].edit) {
                    textFields[i].style.height = "auto";
                    textFields[i].style.height = textFields[i].scrollHeight + "px"
                }
            }


            /*
            for (let i = 0; i < state.values.length; i++) {
                if (state.values[i].edit == false){
                    textFields[i].style.opacity = 0
                    textFields[i].style.display = "none"
                    markdownFields[i].style.display = "block"
                } else {
                    textFields[i].style.opacity = 1
                    textFields[i].style.display = "block"
                    markdownFields[i].style.display = "none"
                }

               
                textFields[i].style.height = "auto";
                textFields[i].style.height = textFields[i].scrollHeight + "px"
                
            }*/
        })

    }, [])
    
    useEffect(() => {
        
        
        for (let i = 0; i < state.values.length; i++) {
            
            if (state.values[i].edit) {
                let textField = document.getElementsByClassName("textarea"+i)[0];
                if (textField != undefined){
                    textField.style.height = "auto";
                    textField.style.height = textField.scrollHeight + "px"
                }
                /*
                textField.style.height = "auto";
                textField.style.height = textField.scrollHeight + "px"
                */
            }
            
    }

    /*
    let text = document.getElementsByClassName("textarea")
    console.log(text)
    */
    }, [state])
    



    return (

    <div>

        {/* TEMP FIX, Need a "Loading" indicator when fetching from server
        for now, if the first section is empty, it will say "loading" */}
        {state.values[0].value?
        
        <div className='container'>
        
        
        <div className='tool-bar'>
            <div className="open-panel">
                <h1 className='panel-btn' onClick={()=>retractPanel()}> {`>`} </h1>
            </div>
        </div>
        <div className='nav-panel'>
         {panel?
            state.values.map((value, index)=>{
            return <div className='section-text' onClick={()=>{handleScroll(index)}}>
                {value.title.length <= 30? value.title : value.title.substring(0,30)+"..."}

                </div>
        })
        :""}
        <h1 className='back-btn' onClick={()=>retractPanel()}> {`<`} </h1>
        </div>

        

        <div class="board">
       {state.Id?  <h3>ID is: {state.Id}</h3> : <h3>New Document</h3>}
       
        

            {state.values.map((st, index) => (
            <div key={index} className="section-containers">

                {/* Title textareas*/}
                <textarea value={st.title} className="titles" onChange={(e) => handleTitleChange(index, e)}>
                </textarea>
                <button className="expand-btn">Expand</button>


                {console.log(st.edit)}
                <h2 className='mode-title'> {st.edit?"Edit Mode":"Markdown Mode"} </h2>
                {st.edit?
                <div>

                  {/* Package it into an react comp so it can take values */}   
                <textarea className={`textarea textarea${index}`} placeholder='Enter text here' value={st.value} onChange={(e) => handleChange(index, e)}>


                </textarea>
                <h1>{index}</h1>
                </div>
                : ""}
                    {/*<h1 className='markdown-title'>Markdown</h1>*/}
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
            : "Loading"}
        </div>
    )
}
