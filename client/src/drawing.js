import './drawing.css';
import { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import React from 'react'
import { UserAuth } from './AuthContext';
import axios from 'axios';
import NotFoundPage from './compoents/NotFoundPage';
import NoPermissionPage from './compoents/NoPermissionPage';
import { BoardEditingContext } from './EditorContext';
import SectionContainers from './compoents/SectionContainers';
import ShareCard from './compoents/NoteCompoents/ShareCard';


/*
 TODO:

    - Make all "Width hidden" compoents to use the "isCondense" instead

*/


export default function Drawing() {
    let navigate = useNavigate();
    let {state, setstate, handleSave, setSave, setCondense, isCondense, handleScroll} = BoardEditingContext()

/*
    Change History:
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
    const [sharePanel, setSharePanel] = useState(false)
    const [shareNames, setShareNames] = useState()

    let currentRight = useRef(0);
    let noteBoard = useRef();



    function handleAdd() {
        setstate({...state,values:[...state.values, {title: "New Section", value:[{
            text: "good2",
        },
        {
            text: "bye2",
        }
            ], edit: true}]})

        setSave(true)
    }


    function handleChange(index, e, vIndex) {
        const value = [...state.values]    //Spread the state into individual array elements
        value[index]["value"][vIndex]["text"] = e.target.value  //Set the key named "value" in that index to the input
        setstate({...state,values:value}) //Update the state with the new state

        setSave(true)


        
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";



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
            if (isCondense){
                navPanel.style.width = "70%";
            } else {
                navPanel.style.width = "15%";
            }
            navPanel.style.opacity = 100;
            navPanel.style.minWidth = "15%"
            navPanel.style.transform = "translateX(0)"
            board.style.marginLeft="-1rem"

        }
        
    }


    const handleAdditionalBlock = (index) => {
        let value = state.values
        value[index]["value"].push({
            text: "New Block",
        })
        
        setstate({...state, values: value})

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
            board.classList.add("right-active")
            rightPanel.classList.add("active")
            //rightPanel.style.width="40vw"
  
            leftArrow.style.transform="rotateY(180deg)"
            rightArrow.style.transform="rotateY(180deg)"
        } else {
            board.classList.remove("right-active")
            rightPanel.classList.remove("active")

            //rightPanel.style.width="0"

            leftArrow.style.transform="rotateY(0deg)"
            rightArrow.style.transform="rotateY(0deg)"
        }
        
       // window.scrollTo({left:100, behavior: 'smooth'})


    }

    
    const EditThis = (index, vIndex) => {
 
        setRightContent({index:index, vIndex:vIndex})

        if (!right) {
            handleRight()
        }
    }

    const handleDocumentTitle = (e) => {
        //console.log(e.target.value)
        let inputBox = document.getElementsByClassName("doc-title")[0]
        const val = e.target.value
        if (e.target.value.length >= 30) {
            inputBox.style.textAlign = "left"
        } else {
            inputBox.style.textAlign = "center"
        }

        setstate({...state, title:val})
        console.log(state)

        setSave(true)
    }



    const handleDeleteNooto = () => {
        if (currentUser) {
            axios.post('/api/nooto/delete', {
                id: state.Id,
                UID: currentUser.uid
            }).then(res=>{
                navigate("/")
            })
        }
    }


    // ------ Util function

    const handleSettingPanel = () => {
        setSettingPanel(!settingPanel)
        setSharePanel(false)
        let panel = document.getElementsByClassName("setting-panel-container")[0]

    }

    const handleAddShare = (e) => {
        e.preventDefault()
        let field = document.getElementsByClassName("share-field")[0].value
        
        let newShareValue = state.share
        if (state.share.includes(field)) {
            return
        }

        newShareValue.push(field)
        console.log(newShareValue)

        
        axios.post('/api/updateshare', {
            id: state.Id,
            share: newShareValue,
            difference: field,
            type:"Add"
         }).then((res) => {
            if (res.status === 200 && res.data.shareNames) {
                console.log(res.data.shareNames)
                setShareNames(res.data.shareNames)
                setstate({...state, share:newShareValue})
            } {
            }
         }).catch(err=> {
            console.log("400 STATUS, No user added" + err.response.status)
         })
    


    }
  

    const handleSharePanel = () => {
        setSettingPanel(false)
        setSharePanel(!sharePanel)
    }

    const handleShareDelete = (cardIndex) => {
        let newShareValue = state.share.filter((val)=> val != state.share[cardIndex])
        let deleteList = [state.share[cardIndex]]
        console.log("delete")
        
        
        axios.post('/api/share/delete', {
            id: state.Id,
            share: newShareValue,
            difference: deleteList,
            type:"Delete"
         }).then((res) => {
            setstate({...state, share:newShareValue})
            if (res.data.shareNames) {
                setShareNames(res.data.shareNames)
            }
         })
         
        
        
    }


    const windowSizeCheck = () => {
        if (window.innerWidth < 765) {
            setCondense(true)
        } else {
            setCondense(false)
        }
    }


    const calibrateForScreenSize = () => {
        let board = noteBoard.current
        if (board == undefined) {
            return
        }

        console.log(currentRight.current)
        if (board.classList.contains("right-active")) {
            board.classList.remove("right-active")
            setRight(!currentRight.current)
        }
        windowSizeCheck()

        console.log(window.innerWidth)

    }

    useEffect(() => {
        windowSizeCheck()
        window.addEventListener('resize', calibrateForScreenSize);


        return () => window.removeEventListener('resize', calibrateForScreenSize)
    }, [])

    useEffect(() => {
        currentRight.current = right
    }, [right])


    useEffect(() => {

        let markdownFields = document.getElementsByClassName("results");
        let textFields = document.getElementsByClassName("textarea");

        if (currentUser) {
            axios.post('/nooto', {
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
                    
                    setShareNames(res.data.shareNames)
                    if (data.owner !== currentUser.uid) {
                        setCondense(true)
                    }

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





    }, [currentUser])
    
 
    

 
    


    let pg = (

    <div className="full">

        {/*console.log(save)*/}
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

            {isCondense? <div className='view-only-text'>View Only</div> : "" }

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
                            
                            {shareNames && shareNames.map((v, cardIndex)=>{

                                // TODO: Make this into a comp
                                return (
                                <ShareCard v={v} cardIndex={cardIndex} handleShareDelete={handleShareDelete} isCondense={isCondense}/>)
                            })}

                        </div>
                    
                        {!isCondense? 
                        <div className='share-add-section'>
                            <h3 className='share-titles'>Add user to this Nooto</h3>
                            <input className='share-field' type="text"/>
                            <button onClick={(e)=>handleAddShare(e)} className='share-add-btn'> Add User</button>


                        </div>
                        : ""}


                </div>
                
                
                : ""}
                </div>

                
                <div className='title'>
                    <h1 className='setting-icon' onClick={()=>handleSettingPanel()}> O </h1>
 
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
                            <textarea disabled={isCondense? true : false} value={state.title} className="setting-title-field" onChange={(e) => handleDocumentTitle(e)}/>

                        </div>
                        
                        <div>
                        {isCondense? "" :
                            <div className="setting-delete-nooto">
                                <button onClick={handleDeleteNooto} className="setting-delete-btn">Delete This Nooto</button>
                            </div>
                        }
                        </div>

                    </div>
                                    : ""}


                </div>


                {!isCondense?
                <div className='panel-btn edit-btn' onClick={()=>handleRight()}>
                    <h1 className='arrow-btn'> {`<`}</h1>
                    <h1 className='arrow-btn'> {`>`}</h1>
                </div>
                : ""}
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

        

        <div ref={noteBoard} class="board">
       {/*<input onChange={(e)=>handleDocumentTitle(e)}/>*/}
       <input disabled={!isCondense? false : true} className="doc-title" spellcheck="false" onChange={(e)=>handleDocumentTitle(e)} value={state.title}/>


            {state.values.map((st, index) => (

                <SectionContainers index = {index} handleAdditionalBlock={handleAdditionalBlock} EditThis={EditThis}/>
            )) }
            
        {!isCondense?
            <div className='footer'>
                <button className='util-btn add-btn' onClick={handleAdd}> + Add Section</button>
                {/*<button onClick={handleCloseAll}>Close All Edit</button>*/}
                <button className='util-btn save-btn' onClick={handleSave}> v Save Nooto</button>
            </div>
        : "" }
           
            {/*<button onClick={handleScroll(0)}> scroll </button>*/}
            

            </div>
            
            {/* Board ends here */}
        
            {!isCondense?
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
        : ""}
            
            </div>
            </div>
            : "Loading"}
                    
        </div>
    )
    if (fail === "Error") {return <NotFoundPage/>} else if (fail === "No Permission") {return <NoPermissionPage/>} else {return pg}

}

