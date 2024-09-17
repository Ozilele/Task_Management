import { Avatar } from "@mui/material"
import { TaskState, User } from "../types/project-types"

type DropdownListProps = {
  value: string | User,
  style?: React.CSSProperties,
  setFunc: (arg: string | User) => void,
  items: User[] | TaskState[]
}

const DropdownList = ({ value, style, setFunc, items }: DropdownListProps) => {
  const onItemClick = (e: React.MouseEvent<HTMLLIElement>, item: string) => {
    // e.stopPropagation();
    setFunc(item);
  }
  const isOptionSelected = (item: string | User) => {
    return item === value;
  }

  return (
    <div style={style} className='z-10 mt-1 flex flex-col absolute top-full w-full bg-white rounded-t-none rounded-md'>
      <ul className='flex flex-col gap-2 list-none px-2 mb-3.5 mt-1.5 min-h-1/2'>
        {items.map((item, i) => {
          if(typeof item === "string") {
            return (
              <li 
                key={i} 
                onClick={(e) => onItemClick(e, item)} 
                className={`w-full py-1  px-1 border-b-2 border-stone-700 hover:bg-slate-300 cursor-pointer ${isOptionSelected(item) ? "bg-registerBlue" : ""}`}
              >
                {item}
              </li>
            )
          } else if(typeof item === "object") {
            return (
              <div 
                key={item.id} 
                onClick={() => setFunc(item)}
                className="w-full py-2 flex justify-between items-start border-b-2 border-violet-400"
              >
                <div className="flex items-center gap-1">
                  <Avatar className="!w-7 !h-7">{item.name[0].toUpperCase()}</Avatar>
                  <h4>{item.name}</h4>
                </div>
                <h4>{item.specialization[0] + item.specialization.slice(1).toLowerCase()}</h4>
              </div>
            )
          }
        })}
      </ul>
    </div>
  )
}

export default DropdownList;