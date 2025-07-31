import "./Sidebar.css"
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext";
import { v4 as uuidv4 } from 'uuid';


function Sidebar () {

    const { allThreads , setAllThreads , currThreadId , setNewChat ,setPrompt, setReply, setCurrThreadId, setPrevChats} = useContext(MyContext)

    const getAllThread = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/threads")
            const res = await response.json();
            const filterData = res.map(thread => ({ threadId : thread.threadId ,  title :  thread.title}))
            // console.log(filterData)
            setAllThreads(filterData)
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        getAllThread()
    }, [currThreadId])


    const createNewChat = () => {
        setNewChat(true)
        setPrompt("")
        setReply(null)
        setCurrThreadId(uuidv4())
        setPrevChats([]) 
    }

    const changeThread = async(newThreadId) => {
        setCurrThreadId(newThreadId)

        try {
            const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`)
            const data = await response.json();
            console.log(data)
            setPrevChats(data)
            setNewChat(false)
            setReply(null)
        } catch (error) {
            console.log(error)
        }
    }


    const deleteThread = async(threadId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, { method : "DELETE"})
            const data = await response.json();

            console.log(data)

            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId))
            if(threadId === currThreadId) {
               createNewChat()
            }
            
        } catch (error) {
            console.log(error)
        }   
    }

    return  (
       <section className="sidebar">
            <button onClick={createNewChat}>
                <img src="src/assets/blacklogo.png" alt="chat gtp logo" className="logo" />
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>


            <ul className="history">
                { allThreads?.map((thread,idx) => (
                    <li key={idx} onClick={(e) => changeThread(thread.threadId)}
                    > {thread.title} 
                        <i className="fa-solid fa-trash"
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteThread(thread.threadId)
                        }}
                        ></i>
                    </li>
                ))}
            </ul>
            <div className="sign">
                <p>By Ramaanathinst &hearts;</p>
            </div>
       </section>
    )
}

export default Sidebar;