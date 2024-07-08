import React, { useState,useRef,useEffect } from "react"
import './App.css';

function App() {

  const [value,setValue] = useState('');

  const [error, setError] = useState('');
  
  const [chatHistory, setChatHistory] = useState([])


  const defaultOption = [
    'Who won the nobel peace-prize this year?',
    'What is the capital of France?',
    'Who is the current President of the United States?',
    'What is the largest planet in our solar system?',
    'What is the speed of light?',
  ]

     const defaultQues = () => {
      const randomIndex = Math.floor(Math.random() * defaultOption.length);
      const randomValue = defaultOption[randomIndex];
      console.log(randomValue)
      setValue(randomValue);
    };
    
     const getResponse = async() => {
      if(!value){
        setError("Error! You have not asked anything.")
        return
      }

      try{
        const options = {
          method:'POST',
          body: JSON.stringify({

            history: chatHistory,
            message: value

          }),

          headers: {
            'Content-Type':'application/json'
          }
        };
        
        // const response = await fetch('http://localhost:5000/gemini',options)
         const response = await fetch('https://chatbot-xkuj.onrender.com/gemini',options)
         const data = await response.text()
         console.log(data)

         setChatHistory(oldChatHistory => [...oldChatHistory, { role:"user",  parts: [{ text: value }],},
                                                                { role:"model", parts:[{ text: data }],}
        ]);

        setValue("")

      }catch(error){
          console.log(error)
          setError("Error in getting data! Please try again latter.")
      }
  };
  
  const clear = () => {
    setValue("")
    setError("")
    setChatHistory([])
  };
  console.log(chatHistory)

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <>
    <div className="heading">
      <h2>CHATBOT</h2>
    </div> 
      <div className="app">
           <p>Hi there! How can I help you ?
           <button className="defaultQues" onClick={defaultQues} disabled={!!value || !!error || chatHistory.length}>Default</button>
           </p>
           
           <div className="container-input">
               <input value = {value} 
                      placeholder="Type your queries here..." 
                      onChange = {(e) => setValue(e.target.value)}
               />
              {!error && <button onClick={getResponse}>Click</button>}
              {error &&  <button onClick={clear}>Clear</button>}
           </div>

           {error && <p>{error}</p> }

           <div className="search-result" ref={chatContainerRef}>
                {chatHistory.map ((chatItem,index) =>( <div key={index} className={`answer ${chatItem.role}`} >
                  <p >{chatItem.role  === 'user' ? 'You:' : 'Bot:'} : {chatItem.parts[0].text} </p>
                  
                   </div> 
              ))}
           </div>
      </div>
      </>
  );
}

export default App
