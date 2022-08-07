import './drawing.css';
import { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import React from 'react'
import { UserAuth } from './AuthContext';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import { materialOceanic } from 'react-syntax-highlighter/dist/esm/styles/prism'
import NotFoundPage from './compoents/NotFoundPage';
import NoPermissionPage from './compoents/NoPermissionPage';
import { BoardEditingContext } from './EditorContext';
import SectionContainers from './compoents/SectionContainers';


/*
 TODO:
    - Make a loading page compoent for when the user is trying to access an non-existent
    Nooto, it should bring the user to a page saying "Nooto doesn't exist" instead
    of just redirecting the user back to the profile page

*/


export default function Drawing() {
    let navigate = useNavigate();
    let {state, setstate} = BoardEditingContext()

/*
    What I did last time:
        Created a "EditThis" function so the user can click this to open the edit panel
        instead of having to toggle.
            - Do this because we don't want users to edit multiple blocks at the same time

    Debug:
        Appearently the "Auto re-size for textarea" in useEffect affect the textarea in the
        right text panel, even thought the textarea class doesn't follow the format of the old
        textarea


*/




    let {id} = useParams();
    const {currentUser, logout} = UserAuth();


    const [panel, setPanel] = useState(false)
    const [right, setRight] = useState(false)
    const [rightContent, setRightContent] = useState()
    const [load, setLoad] = useState(true)
    const [fail, setFail] = useState("Pass")
    const [settingPanel, setSettingPanel] = useState(false)
    const [sharePanel, setSharePanel] = useState(true)


    const [time, setTime] = useState("")
    const [save, setSave] = useState(false)

    let currentState = useRef(0);

/*
    const [state, setstate] = useState({
        Id: "",
        title:"Test Document 2" ,
        lastModified: "Unavailable",
        createdDate: "Unavailable",
        values: [{
            title: "New Section",
            value: [{
                text: "good",
            },
            {
                text: "bye",
            }
                    ],

        }, 

    // Next Section

    {
        title: "New Section",
        value: [{
            text: "good2",
        },
        {
            text: "bye2",
        }
                ],

    }

]})
*/

    function handleAdd() {
        setstate({...state,values:[...state.values, {title: "New Section", value:[{
            text: "good2",
        },
        {
            text: "bye2",
        }
            ], edit: true}]})


    }


    function handleChange(index, e, vIndex) {
        const value = [...state.values]    //Spread the state into individual array elements
        value[index]["value"][vIndex]["text"] = e.target.value  //Set the key named "value" in that index to the input
        setstate({...state,values:value}) //Update the state with the new state
        //console.log(state["values"][index])
        //console.log(state)
        setSave(true)


        
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";



    }

    function handleTitleChange(index, e) {
        const title = [...state.values]    
        title[index]["title"] = e.target.value  
        setstate({...state, values:title}) 
        //console.log(state[index])
        let targetTitle = document.getElementsByClassName("titles")[index];

        if (e.target.value.length < 35) {
            targetTitle.style.height = "5rem";
            targetTitle.style.overflow = "hidden";
                }
        
        setSave(true)
        /*
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";
        */
    }

    /*
    function handleEdit(index, vIndex) {
        let value = [...state.values]    
        //value[index]["edit"] = !value[index]["edit"]
        value[index]["value"][vIndex]["editable"] = !value[index]["value"][vIndex]["editable"]
        setstate({...state, values:value})
        setRightContent({index:index, vIndex:vIndex})
        */
        /*
        for (let i = 0; i < state.values[index]["value"].length; i++) {
            if (state.values[index]["value"]["editable"] && i != vIndex) {
                value[index]["value"][i]["editable"] = !value[index]["value"][i]["editable"]
                setstate({...state, values:value})
            }
        }
        */

        /*
        if (!right) {
            handleRight()
        }
        */


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
    //}

    /*
    function handleCloseAll() {
        const value = [...state.values]
        for (var i = 0; i < state.values.length; i++) {
            value[i]["edit"] = false
            setstate({values:value})
        }
    }
*/

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
        console.log(currentState.current)
        
        let date = new Date().toLocaleString()
        

        axios.post('/save', {
            id: currentState.current.Id,
            title: currentState.current.title,
            values: currentState.current.values,
            lastModified: date,
            share: currentState.current.share
         })


    }


    const retractPanel = () => {
        
        setPanel(!panel)
        let navPanel = document.getElementsByClassName("nav-panel")[0];
        let item = document.getElementsByClassName("section-text");
        let arrow = document.getElementsByClassName("panel-btn")[0];
        let board = document.getElementsByClassName("board")[0];

        if (right) {
            handleRight()
        }

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
            board.style.marginLeft="0"
        } else {
            arrow.style.transform = "rotateY(180deg)"
            navPanel.style.padding = "1rem";
            navPanel.style.width = "15%";
            navPanel.style.opacity = 100;
            navPanel.style.minWidth = "15%"
            navPanel.style.transform = "translateX(0)"
            board.style.marginLeft="-1rem"

        }
        
    }


    const handleScroll = (index) => {
       // Right now it will only scroll to the first element

        let boxes = document.getElementsByClassName("section-containers");
        console.log(boxes[index].getBoundingClientRect().top)
        //boxes[0].scrollIntoView({ behavior: 'smooth' })
       const y = boxes[index].getBoundingClientRect().top + window.pageYOffset - 30
        window.scrollTo({top:y, left:0, behavior: 'smooth'})
    }


    const handleAdditionalBlock = (index) => {
        let value = state.values
        value[index]["value"].push({
            text: "New Block",
        })
        
        setstate({...state, values: value})

    }

    const handleBlockDelete = (vIndex,index) => {

        /* 
    function handleDelete(index) {
        console.log("index: " + index)
        const value = [...state.values]
        console.log(value)
        value.splice(index,1)
        setstate({...state, values: value})
        console.log(state)
        console.log(state.Id)
    } */

    let value = [...state.values]
    value[index]["value"].splice(vIndex,1)
    setstate({...state, values: value})


    }



    const handleTitleExpand = (index, e) => {
        let targetTitle = document.getElementsByClassName("titles")[index];
        let titleHeight = targetTitle.style.height;

        console.log(titleHeight)
        if (titleHeight == "max-content") {
            targetTitle.style.height = "5rem";
            targetTitle.style.overflow = "hidden";
            targetTitle.scrollTop = 0
        } else {
            targetTitle.style.height = "max-content";
            targetTitle.style.overflow = "scroll";
        }
        //targetTitle.style.height = "auto";
        //targetTitle.style.height = targetTitle.scrollHeight + "px";
    }


    const handleRight = () => {
        let rightPanel = document.getElementsByClassName("right")[0];
        let board = document.getElementsByClassName("board")[0];
        let leftArrow = document.getElementsByClassName("arrow-btn")[0];
        let rightArrow = document.getElementsByClassName("arrow-btn")[1];

        //let backBtn = document.getElementsByClassName("right-back-btn")[0];


        setRight(!right)

        if (!right) {
            if (panel) {
              retractPanel()
            }
            rightPanel.style.width="40vw"
            board.style.width="60%"
            board.style.marginRight="0rem"
            leftArrow.style.transform="rotateY(180deg)"
            rightArrow.style.transform="rotateY(180deg)"
        } else {
            rightPanel.style.width="0"
            board.style.width="100%"
            board.style.marginRight="0"
            leftArrow.style.transform="rotateY(0deg)"
            rightArrow.style.transform="rotateY(0deg)"
        }
        
       // window.scrollTo({left:100, behavior: 'smooth'})


    }

    
    const EditThis = (index, vIndex) => {
        //let value = [...state.values]
        //value[index]["value"][vIndex]["editable"] = !value[index]["value"][vIndex]["editable"]
    
        //setstate({...state, values:value})
        setRightContent({index:index, vIndex:vIndex})

        if (!right) {
            handleRight()
        }
    }

    const handleDocumentTitle = (e) => {
        //console.log(e.target.value)
        const val = e.target.value
        setstate({...state, title:val})
        console.log(state)

        setSave(true)
    }



    const handleDeleteNooto = () => {
        if (currentUser) {
            axios.post('/deleteNooto', {
                id: state.Id,
                UID: currentUser.uid
            }).then(res=>{
                navigate("/")
            })
        }
    }


    // ------ Util function
    function swapSection(from, to) {
        let tempStateValues = state.values
        let temp = tempStateValues[from]
        tempStateValues[from] = tempStateValues[to]
        tempStateValues[to] = temp
        setstate({...state, values:tempStateValues})

        handleScroll(to)

        setSave(true)
    }

    const handleSettingPanel = () => {
        setSettingPanel(!settingPanel)
        let panel = document.getElementsByClassName("setting-panel-container")[0]

/*
        if (!settingPanel) {
            panel.style.transform= "translateX(-25rem)"
        } else {
            panel.style.transform= "translateX(0rem)"

        }
        */
    }

    const handleAddShare = () => {
        let field = document.getElementsByClassName("share-field")[0].value
        let newShareValue = currentState.current.share
        newShareValue.push(field)
        setstate({...state, share:newShareValue})
    }
  

    const handleSharePanel = () => {
        setSettingPanel(false)
        setSharePanel(!sharePanel)
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
        /*
        document.addEventListener('scroll', function(e) {
            if (window.pageXOffset >= 4) {
                window.scrollTo({left:0, behavior: 'smooth'})
            }
        })
        */

        let markdownFields = document.getElementsByClassName("results");
        let textFields = document.getElementsByClassName("textarea");

        if (currentUser) {
            axios.post('/posts', {
                UID: currentUser.uid,
                NootoID: id
            })
            .then((res) => {
                console.log(res.data.note)
                if (res.data.state === 'Pass') {
                    let data = res.data.note
                    setstate({Id:data._id, 
                        title:data.title,
                        lastModified: data.lastModified,
                        createdDate: data.createdDate,
                        owner: data.owner,
                        share: data.share,
                        values:data.values})
                    setLoad(!load)
                    console.log(res.data)
                } 
                else if (res.data.state === "No Permission") {
                    setLoad(false)
                    setFail("No Permission")
                }
                else {
                    setLoad(false)
                    setFail("Error")
                // TODO: Make this a post and let the server decide whether the current user has permission
                // If not, return 'Error', else return the data
                
                //navigate("/")
                     }
          })
        }

/*
        axios.get(`/posts/${id}`).then((res) => {

            if (res.data != 'Error') {
                setstate({Id:res.data._id, 
                    title:res.data.title,
                    lastModified: res.data.lastModified,
                    createdDate: res.data.createdDate,
                    owner: res.data.owner,
                    share: res.data.share,
                    values:res.data.values})
                setLoad(!load)
                console.log(res.data)
            } else {
                setLoad(false)
                setFail("Error")
                // TODO: Make this a post and let the server decide whether the current user has permission
                // If not, return 'Error', else return the data
                
                //navigate("/")
            }
        })
*/



        /*
        .then(()=>{
            
            for (let i = 0; i < state.values.length; i++) {
                for (let j = 0; j < state.values[i]["value"].length; j++) {
                    
                    if (state.values[i]["value"][j].editable) {
                        console.log(999)
                        textFields[i+j].style.height = "auto";
                        textFields[i+j].style.height = textFields[i+j].scrollHeight + "px"
                    }
                }
            }
            

            
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
                
            }
        })*/


    }, [currentUser])
    
    useEffect(() => {
    currentState.current = state
  /*
        for (let i = 0; i < state.values.length; i++) {
            for (let j = 0; j < state.values[i]["value"].length; j++){
                //if (state.values[i].edit) {
                if (state.values[i]["value"][j].editable) {
                    let textField = document.getElementsByClassName("textarea"+i.toString()+j.toString())[0];
                    if (textField != undefined){
                        textField.style.height = "auto";
                        textField.style.height = textField.scrollHeight + "px"
                    }
                   
                }
        }
            
    }*/

    /*
    let text = document.getElementsByClassName("textarea")
    console.log(text)
    */
    }, [state])
    

    useEffect(() => {
        let interval = setInterval(()=>{
        if (save) {

                setSave(false)
                handleSave()
                //document.getElementsByClassName("save-btn")[0].click();
            }
        }, 5000)




      return () => {
        clearInterval(interval);
      }
    }, [save])
    


    let pg = (

    <div className="full">

        {console.log(save)}
        {/* TEMP FIX, Need a "Loading" indicator when fetching from server
        for now, if the first section is empty, it will say "loading" */}
        {/*state.values[0].value? */}
        {!load?
        <div>
            <div className='nav-bar'>
                <div className='nav-title-container'>
                <h1 className='title' style={{cursor: "pointer"}} onClick={()=>navigate("/")}>Nooto</h1>
                <h1 className='panel-btn' onClick={()=>retractPanel()}> {`>`} </h1>
                </div>
                <input className="doc-title" onChange={(e)=>handleDocumentTitle(e)} value={state.title}/>
                
                <div className='nav-title-container'>

                <div className='share'> 
                    <h1 className="share-btn" style={{cursor: "pointer"}} onClick={()=>handleSharePanel()}>^^</h1>

                    {sharePanel? 
                    
                    <div className="share-panel-container"> 
                        <div className='setting-panel-title-container'>
                            <h1 className='setting-panel-title'> Sharing </h1>
                            <h2 className='close-setting-btn' style={{cursor: "pointer"}} onClick={()=>setSharePanel(!sharePanel)}> X </h2>
                        </div>
                        <p style={{color: "white"}}> Owner {state.owner}</p>
                        <p style={{color: "white"}}> Scroll to see more {`->`}</p>
                        <div className='share-users-container'>
                            
                            {state.share && state.share.map((v)=>{

                                // TODO: Make this into a comp
                                return (
                                <div className='share-card'>
                                    <p className='share-id' style={{color: "white"}}>ID: {v}</p>
                                    
                                </div>)
                            })}

                        </div>
                    
                        <div className='share-add-section'>
                            <h3 className='share-titles'>Add user to this Nooto</h3>
                            <input className='share-field' type="text"/>
                            <button onClick={handleAddShare} className='share-add-btn'> Add User</button>


                        </div>



                </div>
                
                
                : ""}
                </div>

                
                <div className='title'>
                    <h1 style={{cursor: "pointer"}} onClick={()=>handleSettingPanel()}> O </h1>
 
                    {settingPanel?
                    <div className="setting-panel-container"> 
                        <div className='setting-panel-title-container'>
                            <h1 className='setting-panel-title'> Settings </h1>
                            <h2 className='close-setting-btn' style={{cursor: "pointer"}} onClick={()=>setSettingPanel(!settingPanel)}> X </h2>
                        </div>
                        
                        <div className='state-id-filed'>
                        {state.Id?  <h3 className='id-text'>ID: {state.Id}</h3> : <h3>New Document</h3>}
                        </div>

                        <div className='date-block-container'>
                            <div className='date-container'>
                            <h3 className='date-titles'>Created Date: </h3>
                            <p className='date-text'>{state.createdDate}</p>
                            </div>
                            <div className='date-container'>
                            <h3 className='date-titles'>Last lastModified: </h3>
                            <p className='date-text'>{state.lastModified}</p>
                            </div>

                        </div>

                        <div>
                            <h3 className='setting-titles'> Title:  </h3>
                            <textarea value={state.title} className="setting-title-field" onChange={(e) => handleDocumentTitle(e)}/>

                        </div>
                        
                        <div>
                            <div className="setting-delete-nooto">
                                <button onClick={handleDeleteNooto} className="setting-delete-btn">Delete This Nooto</button>
                            </div>
                        </div>

                    </div>
                                    : ""}


                </div>


                <div className='panel-btn edit-btn' onClick={()=>handleRight()}>
                    <h1 className='arrow-btn'> {`<`}</h1>
                    <h1 className='arrow-btn'> {`>`}</h1>
                </div>
                </div>

            </div>


        <div className='container'>

        
        <div className='tool-bar'>
            <div className="open-panel">
                {/*<button className='right-btn' onClick={handleRight}>Open Right</button> */}
                
            </div>
        </div>


        <div className='nav-panel'>
         {panel?
            state.values.map((value, index)=>{
            return <div className='section-text' onClick={()=>{handleScroll(index)}}>
                {value.title.length <= 20? value.title : value.title.substring(0,20)+"..."}

                </div>
        })
        :""}
        <h1 className='back-btn' onClick={()=>retractPanel()}> {`<`} </h1>
        </div>

        

        <div class="board">
       <h2>{time}</h2>
       {/*<input onChange={(e)=>handleDocumentTitle(e)}/>*/}
        

            {state.values.map((st, index) => (

                <SectionContainers index = {index} swapSection={swapSection} st={st} handleTitleChange={handleTitleChange} handleTitleExpand={handleTitleExpand} handleBlockDelete={handleBlockDelete} handleAdditionalBlock={handleAdditionalBlock} handleDelete={handleDelete} EditThis={EditThis}/>
            )) }
            
            <div className='footer'>
                <button className='util-btn add-btn' onClick={handleAdd}> + Add Section</button>
                {/*<button onClick={handleCloseAll}>Close All Edit</button>*/}
                <button className='util-btn save-btn' onClick={handleSave}> v Save Nooto</button>
            </div>

           
            {/*<button onClick={handleScroll(0)}> scroll </button>*/}
            

            </div>
            
            {/* Board ends here */}
        
          <div className="right">

                    <div className='right-title-container'>
                    <button className='right-back-btn' onClick={()=> handleRight()}>
                        {">"}
                    </button>
                    <div className='edit-panel-title'>
                        <h1>Edit Panel</h1>
                    </div>
                    </div>



                    {rightContent 
                    
                    ? 
                    <textarea className='textareaRight' value={state.values[rightContent.index]? state.values[rightContent.index]["value"][rightContent.vIndex]["text"] : ""} onChange={(e) => handleChange(rightContent.index, e, rightContent.vIndex)}>
                    </textarea>

                    : "Not editing any block"}

          </div>

            
            </div>
            </div>
            : "Loading"}
                    
        </div>
    )
    if (fail === "Error") {return <NotFoundPage/>} else if (fail === "No Permission") {return <NoPermissionPage/>} else {return pg}

}

