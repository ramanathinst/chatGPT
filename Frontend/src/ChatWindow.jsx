import "./ChatWindow.css"
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useEffect, useState } from "react";
import { ScaleLoader  } from "react-spinners";


function ChatWindow () {

const [loading , setLoading ] = useState(false)


  const { prompt, setPrompt , reply, setReply , currThreadId , setPrevChats ,setNewChat } = useContext(MyContext)
const [ isOpenUserProfile , setIsOpenUserProfile] = useState(false)

  const getReply = async() => {

    setLoading(true)
    setNewChat(false)
    const options = {
        method : "POST",
        headers  : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            message : prompt,
            threadId : currThreadId
        }) 
    }

    try {
        const response = await fetch("http://localhost:8080/api/chat" , options)
        const res = await response.json();
        // console.log(res)
        setReply(res.reply)
        
    } catch (error) {
        console.log(error)
    }

    setLoading(false)
  }

      //Append new chat to prevChats
    
      useEffect(() => {

        if(prompt && reply) {
            setPrevChats( prevChats => ( 
                [...prevChats , {
                    role : "user",
                    content : prompt
                }, {
                    role : "assistant",
                    content : reply
                }]
            ))
        }
        setPrompt("")
      }, [reply])

      const handleUserProfile = () => {
        setIsOpenUserProfile(!isOpenUserProfile)
      }


    return  (
        <div className="chatWindow">
            <div className="navbar">
                <span>SigmaGPT <i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIconDiv" onClick={handleUserProfile}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>

            </div>
            {
                isOpenUserProfile &&
                    <div className="dropdown">
                        <div className="dropdownItem"><i className="fa-solid fa-gear"></i> Setting</div>
                        <div className="dropdownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade</div>
                        <div className="dropdownItem"><i className="fa-solid fa-arrow-right-from-bracket"></i>Logout</div>
                    </div>
            }


    
            <Chat></Chat>

            <ScaleLoader color="#fff" loading={loading}>

            </ScaleLoader >

            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder="Ask anything"
                        value={prompt}
                        onChange={ (e) => setPrompt(e.target.value)}
                        onKeyDown={ (e) => e.key === "Enter" ? getReply() : "" }
                    >
                    </input>

                    <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                </div>
                <p className="info">ChatGPT can make mistakes. Check important info. See <a href="">Cookie Preferences.</a></p>
            </div>
        </div>
    )
}

export default ChatWindow;