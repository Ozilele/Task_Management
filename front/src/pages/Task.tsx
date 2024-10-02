import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ChatMessage } from "../types/project-types";
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import EmojiPicker, { EmojiClickData, EmojiStyle, Theme } from 'emoji-picker-react';
import { dummy_chat_messages } from "../utils/helpers";
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { Avatar } from "@mui/material";
import { ACCESS_TOKEN } from "../constants";

const Task = () => {
  const [chatSocket, setChatSocket] = useState<WebSocket | null>(null);
  const [chatText, setChatText] = useState("");
  const [isChatAreaFocused, setIsChatAreaFocused] = useState<boolean>(true);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [messages, setMessages] = useState([]);

  const { taskId } = useParams();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textAreaRef.current?.focus();
    const accessToken = localStorage.getItem(ACCESS_TOKEN)
    // validate the token -> if accessToken expired make request to refreshToken
    let url = `ws://127.0.0.1:8000/ws/chat/task/${taskId}/?token=${accessToken}`;
    const chatSocket = new WebSocket(url);
    chatSocket.onmessage = function(e) { // handle incoming messages from the server
      const data = JSON.parse(e.data);
      const incomingMsg: ChatMessage = data.message
      console.log("Data: " + data.type + ", " + incomingMsg.content, ", " + data.message_type);
    }
    chatSocket.onclose = function(e) { 
      console.log("Chat socket closed");
    }
    chatSocket.onerror = (error) => {
      console.error("Websocket error:", error);
    }
    setChatSocket(chatSocket);
  }, []);

  const sendMessage = () => {
    chatSocket?.send(JSON.stringify({
      'message': chatText,
      'message_type': 'room',
    }));
  }

  const getMessages = () => {
    // call to db to get previous messages
  }

  const onEmojiClick = (emojiData: EmojiClickData, event: MouseEvent) => {
    setChatText((prev) => prev + emojiData.emoji);
    setIsChatAreaFocused(true);
    textAreaRef.current?.focus();
  }

  return (
    <div className="w-full max-w-1200 mx-auto my-5 py-3 px-1.5 flex flex-col place-items-center bg-black rounded-t-sm">
      <div className="w-full flex-grow flex flex-col gap-2.5 overflow-y-auto">
        {dummy_chat_messages.map((msg, index) => {
          return (
            <div 
              key={index}
              className={`text-md text-wrap ${index % 2 === 0 ? 'self-start' : 'self-end'} flex items-center gap-1 px-2 py-2`}
            >
              <p className="break-words bg-slate-100 text-blacking px-2 py-2 rounded-md">{msg.message}</p>
              <Avatar sx={{ width: 26, height: 26 }}>
                {msg.author[0]}
              </Avatar>
            </div>  
          )
        })}
      </div>
      <div className="mt-5 mb-1 px-1 w-full flex items-center gap-1">
        <div 
          tabIndex={1}
          className={`relative flex-1 flex items-center px-2 py-1 rounded-md bg-zinc-900 ${isChatAreaFocused ? "border-sky-500 ring-2 ring-sky-500" : ""} focus:outline-none`}
        >
          <textarea
            ref={textAreaRef}
            autoComplete='false'
            id="chatText"
            rows={2}
            value={chatText}
            onFocus={() => {
              if(!isChatAreaFocused) {
                setIsChatAreaFocused(true);
              }
            }}
            onBlur={() => {
              if(isChatAreaFocused) {
                setIsChatAreaFocused(false);
              }
            }}
            className='relative w-full flex-1 bg-inherit outline-none focus:outline-none focus:ring-0'
            placeholder="Aa"
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setChatText(e.target.value)}
          />
          <button 
            type="button" 
            className="cursor-pointer" 
            onMouseDown={(e) => {
              e.preventDefault();
              setShowPicker((val) => {
                if(val === true) {
                  textAreaRef.current?.focus();
                }
                return !val;
              });
            }}
          >
            <EmojiEmotionsIcon/>  
          </button>
          {showPicker && 
            <div 
              tabIndex={2}
              // onBlur={() => setShowPicker(false)}
              className="absolute right-0 bottom-full w-60 h-80 sm:w-72 md:w-80 md:h-96"
            >
              <EmojiPicker height="100%" width="100%" theme={Theme.DARK} emojiStyle={EmojiStyle.APPLE} onEmojiClick={onEmojiClick}/>
            </div>
          }
        </div>
        <button type="submit" onClick={() => sendMessage()}>
          <SendRoundedIcon className="!w-6 !h-6 text-homeInputFocus"/>
        </button>
      </div>
    </div>
  );
}

export default Task;
