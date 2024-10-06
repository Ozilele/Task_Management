import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChatMessage, RoomMessage } from "../types/project-types";
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import EmojiPicker, { EmojiClickData, EmojiStyle, Theme } from 'emoji-picker-react';
import { refreshToken } from "../utils/helpers";
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { ACCESS_TOKEN } from "../constants";
import api from "../api";
import { jwtDecode } from "jwt-decode"
import { useSelector } from "react-redux";
import { selectLoggedUser, selectProjectUsers } from "../features/appSlice";
import ChatBubble from "../components/ChatBubble";

type BackendMessage = {
  author: number,
  id: number,
  content: string,
  timestamp: string,
  receiver: number | null,
  attachment: string,
}

const Task = () => {
  const [chatSocket, setChatSocket] = useState<WebSocket | null>(null);
  const [chatText, setChatText] = useState("");
  const [isChatAreaFocused, setIsChatAreaFocused] = useState<boolean>(true);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const { taskId } = useParams();
  const navigate = useNavigate();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const projectUsers = useSelector(selectProjectUsers);
  const loggedUser = useSelector(selectLoggedUser);

  useEffect(() => {
    textAreaRef.current?.focus();
    let token = null;
    try {
      token = preprocessToken();
    } catch(err) {
      navigate("/auth/login");
      return;
    }
    let url = `ws://127.0.0.1:8000/ws/chat/task/${taskId}/?token=${token}`;
    const chatSocket = new WebSocket(url);
    chatSocket.onmessage = function(e) { // handle incoming messages from the server
      const data = JSON.parse(e.data);
      const incomingMsg: ChatMessage = data.message;
      setMessages((prev) => {
        const newMsg: RoomMessage = {
          content: incomingMsg.content,
          timestamp: incomingMsg.timestamp,
          author: projectUsers?.find(user => user.id === incomingMsg.author),
        }
        return [...prev, newMsg];
      });
    }
    chatSocket.onclose = function(_) { 
      console.log("Chat socket closed");
    }
    chatSocket.onerror = (error) => {
      console.error("Websocket error:", error);
    }
    setChatSocket(chatSocket);
    getMessages();
  }, []);

  const preprocessToken = () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if(!accessToken) {
      throw new Error("No access token found");
    }
    const decoded = jwtDecode(accessToken);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000
    if(tokenExpiration! < now) { // if token is expired
      refreshToken(true)
        .then((newAccessToken: string) => {
          if(newAccessToken) {
            localStorage.setItem(ACCESS_TOKEN, newAccessToken);
            return newAccessToken;
          } else {
            throw new Error("Error happened");
          }
        })
        .catch(err => {
          console.error(err);
          throw new Error("Error getting new access token");
        });
    }
    else {
      return accessToken;
    }
  }

  const getMessages = () => { // call to db to get previous messages
    api.get(`/chat/messages/task/${taskId}/`)
    .then(response => {
      if(response.status === 200) {
        const messages = response.data.map((msg: BackendMessage) => {
          const message: RoomMessage = {
            content: msg.content,
            author: projectUsers !== null ? projectUsers.find((user) => user.id === msg.author) : null,
            timestamp: msg.timestamp,
          }
          return message;
        });
        setMessages(messages);
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  const sendMessage = (event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    if(chatText !== "") {
      chatSocket?.send(JSON.stringify({ // Send message through WebSocket
        'message': chatText.trim(),
        'message_type': 'room',
      }));
      setChatText("");
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if(event.key === 'Enter' && !event.shiftKey) {
      sendMessage(event);
    }
  }

  const onEmojiClick = (emojiData: EmojiClickData, _: MouseEvent) => {
    setChatText((prev) => prev + emojiData.emoji);
    setIsChatAreaFocused(true);
    textAreaRef.current?.focus();
  }

  return (
    <div className="w-full max-w-1200 mx-auto my-5 py-3 px-1.5 flex flex-col items-center bg-black rounded-t-sm">
      <div className="w-full min-h-[500px] max-h-[800px] flex-grow flex flex-col justify-end gap-3.5 overflow-y-auto">
        {messages.map((msg, index) => {
          const isLoggedUserMsg = loggedUser?.id === msg.author?.id
          return (
            <ChatBubble
              key={index}
              isLoggedUserMsg={isLoggedUserMsg}
              msg={msg}
            />
          )
        })}
      </div>
      <form
        onSubmit={sendMessage} 
        className="mt-6 mb-1 px-1 w-full flex items-center gap-1"
      >
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
            onKeyDown={handleKeyDown}
            className='relative resize-none w-full flex-1 bg-inherit outline-none focus:outline-none focus:ring-0'
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
              className="absolute right-0 bottom-full w-60 h-80 sm:w-72 md:w-80 md:h-96"
            >
              <EmojiPicker height="100%" width="100%" theme={Theme.DARK} emojiStyle={EmojiStyle.APPLE} onEmojiClick={onEmojiClick}/>
            </div>
          }
        </div>
        <button type="submit" onClick={sendMessage}>
          <SendRoundedIcon className="!w-6 !h-6 text-homeInputFocus"/>
        </button>
      </form>
    </div>
  );
}

export default Task;
