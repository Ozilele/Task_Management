import { Avatar } from "@mui/material"
import { TaskState, User } from "../types/project-types"
import { memo } from "react"

type DropdownListProps = {
  multiple: boolean,
  value: string | User[] | undefined,
  style?: React.CSSProperties,
  isOpen: boolean,
  onChange: (arg: string | User) => void,
  items: User[] | TaskState[]
}

const DropdownList = ({ multiple, value, style, isOpen, onChange, items }: DropdownListProps) => {
  
  const isOptionSelected = (item: string) => {
    if(!multiple) {
      return item === value;  
    } else {
      if(Array.isArray(value)) {
        return value.some(user => user.username === item);
      }
    }
  }
  return (
    <div 
      style={style} 
      className={`z-10 mt-1.5 absolute left-0 top-full w-full rounded-t-none rounded-md transition-all ease-in delay-100 duration-200 ${isOpen ? 'opacity-100 translate-y-0 flex flex-col' : 'opacity-0 translate-y-3 hidden'}`}
    >
      <ul className='flex flex-col gap-1.5 list-none px-1.5 mb-5 mt-2 min-h-1/2'>
        {items.map((item, i) => {
          if(typeof item === "string") {
            return (
              <li 
                key={i} 
                onClick={(e) => {
                  e.stopPropagation();
                  if(item !== value) {
                    onChange(item);
                  }
                }}
                className={`w-full rounded-sm py-1.5 px-1 border-b-2 border-stone-700 transition-all ease-linear duration-150 hover:bg-blue-500 cursor-pointer ${isOptionSelected(item) ? "bg-myBlue" : ""}`}
              >
                {item}
              </li>
            )
          } else if(typeof item === "object") {
            return (
              <div 
                key={item.id} 
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(item);
                }}
                className={`w-full py-2 flex justify-between items-start cursor-pointer border-b-2 border-slate-400 ${isOptionSelected(item.username) && "bg-myBlue"}`}
              >
                <div className="flex items-center gap-1.5 px-2">
                  <Avatar className="!w-7 !h-7 !bg-slate-200">{item.username[0].toUpperCase()}</Avatar>
                  <h4>{item.username}</h4>
                </div>
              </div>
            )
          }
        })}
      </ul>
    </div>
  );
}

export default memo(DropdownList);