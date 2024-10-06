import { Avatar } from "@mui/material";
import { RoomMessage } from "../types/project-types";
import { useState } from "react";
import { formatMessageDate, stringToColor } from "../utils/helpers";

export interface ChatBubbleProps {
  isLoggedUserMsg: boolean,
  msg: RoomMessage
}

const ChatBubble = ({ isLoggedUserMsg, msg }: ChatBubbleProps) => {
  const [showTimestamp, setShowTimestamp] = useState<boolean>(false);

  return (
    <div 
      onMouseEnter={() => setShowTimestamp(true)}
      onMouseLeave={() => setShowTimestamp(false)}
      className={`relative text-md text-wrap ${isLoggedUserMsg ? 'self-end' : 'self-start'} flex items-center gap-1`}
    >
      <div className={`absolute top-1/2 -translate-y-1/2 ${isLoggedUserMsg ? 'right-full' : 'left-full'} z-10 w-max px-1 py-1 bg-gray-300 text-blacking rounded-md shadow-sm transition-opacity duration-200 ${showTimestamp ? 'opacity-100' : 'opacity-0'}`}>
        {formatMessageDate(msg.timestamp)}
      </div>
      {isLoggedUserMsg && (
        <p className={`break-words bg-chatBubble text-white px-2 py-2 rounded-md`}>{msg.content}</p>
      )}
      {!isLoggedUserMsg &&
        <>
        <Avatar className="!cursor-pointer" sx={{ width: 26, height: 26, bgcolor: stringToColor(msg.author?.username) }}>
          {msg.author?.username[0].toUpperCase()}
        </Avatar>
        <p className={`break-words bg-slate-100 text-blacking px-2 py-2 rounded-md`}>{msg.content}</p> 
        </>
      }
    </div>  
  );
}

export default ChatBubble;