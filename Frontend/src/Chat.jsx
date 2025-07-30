import { useContext, useEffect, useState } from "react";
import "./Chat.css"
import { MyContext } from "./MyContext.jsx";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"

function Chat () {

   const { prevChats , newChats , reply } = useContext(MyContext)

    const [ latestReply , setLatestReply ] = useState(null);

    useEffect(() => {
        if(!prevChats.length) return;

        const content = reply.split(" ");
        let idx = 0;

        const interval = setInterval(() => {
            setLatestReply(content.slice(0 , idx+1).join(" "));
            idx++;

            if(idx >= content.length) clearInterval(interval)
        }, 40)

        return () => clearInterval(interval)
    } , [prevChats ,reply])

    return  (
        <>
        { newChats && <p> Start a new chat!</p>}

        <div className="chats">

                {
                    prevChats?.slice(0 , -1).map((chat, idx) => 
                        <div className={chat.role === "user"? "userDiv" : "gptDiv"} key={idx}>
                            {
                                chat.role === "user"? 
                                <p className="userMessage">{chat.content}</p> : 
                                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
                            }
                        </div>
                    )
                }

                {
                    prevChats?.length > 0 && latestReply !== null &&
                        <div className="gptDiv" key={"typing"}>
                      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
                        </div>
                }

        </div>
        </>
    )
}

export default Chat;