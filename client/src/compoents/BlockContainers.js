import React from 'react'
import ReactMarkdown from 'react-markdown';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import { materialOceanic } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { BoardEditingContext } from '../EditorContext';


export default function BlockContainers({value, vIndex, index, EditThis}) {

  let {handleBlockDelete, isCondense} = BoardEditingContext()


  return (
    <div className='block-container'>
                <h2 className='mode-title'> {"Markdown Mode"} </h2>

                
                <div>
                  {/* style={{display: fieldState? "inline-block" : "none"}} */}
                  {/* Package it into an react comp so it can take values */}   

                {/*
                <textarea style={{display: v.editable? "block" : "none"}} className={`textarea textarea${index}${vIndex}`} placeholder='Enter text here' value={v.text} onChange={(e) => handleChange(index, e, vIndex)}>


                </textarea>
                */}
                {/*<h1>{index}</h1>*/}
                </div>
              
              
                    {/*<h1 className='markdown-title'>Markdown</h1>*/}
                <div>
                        <ReactMarkdown components={{
                            pre: ({node, ...props}) => 
                            <div>
                                <pre {...props}> {props.children} </pre>
                            </div>,

                            h1: ({node, ...props}) =>
                                <h1 style={{lineHeight:"2rem"}}> {props.children} </h1>
                                ,
                            code({node, inline, className, children, ...props}) {
                                    const match = /language-(\w+)/.exec(className || '')
                                    return !inline && match ? (
                                        <div style={{position:"relative"}}>
                                      <SyntaxHighlighter
                                        children={String(children).replace(/\n$/, '')}
                                        language={match[1].toLowerCase()}
                                        style={materialOceanic}
                                        className="code-highlighter"
                                        //useInlineStyles={false}
                                        customStyle={{borderRadius:"15px", margin:"0"}}
                                        PreTag="div"
                                        wrapLines={true}
                                        wrapLongLines={true}
                                        {...props}
                                      />
                                      <p className='language-tag'>{match[1].charAt(0).toUpperCase() + match[1].slice(1)}</p>
                                      </div>
                                    ) : (
                                      <code className={className} {...props}>
                                        {children}
                                      </code>
                                    )
                                  }
                            
                        }} 
                        children={value.text} className="results"/>
                </div>

                
               
                {/* TODO: Move the "Add Additional Block" out of the loop*/}

                
                {/*<button class="toggle-btn btn" onClick={() => handleEdit(index, vIndex)}> Toggle Edit </button>*/}
                {!isCondense?
                <div class="block-controls-container">
                  <button class="delete-btn block-btn" onClick={() => handleBlockDelete(vIndex, index)}> Delete Block </button>
                  <button class="toggle-btn block-btn" onClick={() => EditThis(index, vIndex)}>Edit Block </button>
                </div>
                : "" }

                </div>
  )
}
