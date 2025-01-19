import React, { useEffect, useState, useRef } from 'react';
import botChat from "../assets/logo.gif";
import man from "../assets/dashboard/profileFace.webp";
import girl from "../assets/dashboard/queen.png";
import { API_BASE_URL } from "../config";
import useAxios from '../context/UseAxios';
import saga from "../assets/chatBot/saga.png";
import './Chatbot.css';
import ReactMarkdown from 'react-markdown';

const Chatbot = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: 'Hello! How can I help you today?', sender: 'bot', isTyping: false }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // const api = useAxios();
  const [userImage, setUserImage] = useState({});
  const [isLive, setIsLive] = useState(true);
  const apiResponse = async (prompt, onStreamData) => {
    try {
      const response = await fetch('https://hookworm-upward-eminently.ngrok-free.app/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "prometeo_iter4",
          prompt: prompt,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let buffer = ''; // Buffer to hold incomplete JSON chunks

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk; // Append new chunk to buffer

        // Attempt to extract JSON objects from the buffer
        let boundaryIndex;
        while ((boundaryIndex = buffer.indexOf('}')) !== -1) {
          const jsonString = buffer.slice(0, boundaryIndex + 1); // Extract one JSON object
          buffer = buffer.slice(boundaryIndex + 1); // Remove the processed part

          try {
            const jsonObject = JSON.parse(jsonString); // Parse the JSON object
            onStreamData(jsonObject.response); // Pass the `response` field to the callback
          } catch (error) {
            console.error('Error parsing JSON chunk:', error.message);
            break; // Exit the loop if there's a parsing error
          }
        }
      }

      return; // No final concatenation needed
    } catch (error) {
      console.error('Error in streaming:', error.message);
      throw error;
    }
  };


  const userAsk = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      text: inputMessage,
      sender: 'user',
      isTyping: false,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Add initial bot message and calculate index
    let botMessageIndex;
    setMessages((prev) => {
      botMessageIndex = prev.length; // Index of the new bot message
      return [...prev, { text: '', sender: 'bot', isTyping: true }];
    });

    try {
      await apiResponse(inputMessage, (chunk) => {
        // Update bot message incrementally
        setMessages((prev) =>
          prev.map((msg, index) =>
            index === botMessageIndex
              ? { ...msg, text: msg.text + chunk }
              : msg
          )
        );
      });

      // Mark bot message as not typing
      setMessages((prev) =>
        prev.map((msg, index) =>
          index === botMessageIndex
            ? { ...msg, isTyping: false }
            : msg
        )
      );
      setIsLive(true);
    } catch (error) {
      console.error('Chat Error:', error.message);
      setMessages((prev) =>
        prev.map((msg, index) =>
          index === botMessageIndex
            ? { ...msg, text: 'Error: Please try again later', isTyping: false }
            : msg
        )
      );
      setIsLive(false);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   const userPic = async () => {
  //     const responses = await api.get(`${API_BASE_URL}accounts/userdata/`);
  //     if (responses.status === 200) {
  //       setUserImage(responses.data);
  //     } else {
  //       console.log("notImage");
  //     }
  //   };
  //   userPic();
  // }, []);


  // const handleTypingComplete = (index) => {
  //   setMessages(prev => prev.map((msg, i) =>
  //     i === index ? { ...msg, isTyping: false } : msg
  //   ));
  // };

  const touchClose = useRef(null);

  useEffect(() => {
    const clickOnscreen = (e) => {
      if (touchClose.current && !touchClose.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', clickOnscreen);
    // console.log(clickOnscreen);
    return () => {
      // console.log("removeEventlistener"); 
      document.removeEventListener('mousedown', clickOnscreen)};
  }, []);

  const messageScroll = useRef(null);
  useEffect(() => {
    const scrollLivedown = () => {
      messageScroll.current?.scrollIntoView({behavior: 'smooth'});
    };
    scrollLivedown();
  }, [messages]);

  const messageLive = useRef(null);
  useEffect(()=> {
    const scrollLivedown = ()=> {
      messageLive.current?.scrollIntoView({behavior: "smmoth"});
    };
    scrollLivedown();
  }, [messages]);

  return (
    <div className="chatbot-container" ref={touchClose}>
      <button 
        className="chatbot-toggle flex justify-center items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
      </button>

      {isOpen && (
        <div className="chatbot">
          <div className="chat-header">
            <div className='saga_header'></div>
            <div className='saga_title'>
              <p className='saga_name'>Saga</p>
              {isLive ?
                (<p className='online'> <span className='liveDots'>&#11044;</span>Online</p>) :
                (<p className='online text-red-600'> <span className='liveDots'>&#11044;</span>Offline</p>)
              }
            </div>
          </div>

          <div className='messages'>
            {messages.map((message, index) => (
              <div key={message.id || index} className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'} ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`message-content inline-block max-w-[80%] rounded-2xl ${message.sender === 'user' ? 'rounded-br-none' : 'rounded-bl-none'}`}>
                  {message.sender === 'bot' ? (
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  ) : (
                    message.text
                  )}
                </div>
              </div>
            ))}
            <div ref={messageScroll}/>
          </div>

          <form onSubmit={userAsk} className="userInput">

            <input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me Anything"
            />
            <button type="submit" disabled={isLoading} className='submitButtonon'>➤</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;