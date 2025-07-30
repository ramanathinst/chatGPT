import Sidebar from './Sidebar.jsx'
import ChatWindow from './ChatWindow.jsx'
import { MyContext } from './MyContext.jsx'
import "./App.css"
import { useState } from 'react' 
import { v4 as uuidv4 } from 'uuid';


function App() {

  const [ prompt , setPrompt ] = useState("")
  const [ reply , setReply ] = useState(null)
  const [ currThreadId , setCurrThreadId] = useState(uuidv4())
  const [ prevChats , setPrevChats] = useState([])
  const [ newChats , setNewChats] = useState(true)


  const providerValues = {
    prompt , setPrompt,
    reply , setReply,
    currThreadId ,setCurrThreadId,
    prevChats, setPrevChats,
    newChats, setNewChats
  };

  return (
    <div className='app'>
      <MyContext.Provider value={providerValues}>
        <Sidebar></Sidebar>
        <ChatWindow></ChatWindow>
      </MyContext.Provider>
    </div>
  )
}

export default App
