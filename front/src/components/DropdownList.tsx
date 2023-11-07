import { Avatar } from "@mui/material"
import { Estimation, Specialization, User } from "../types/project-types"

type DropdownListProps = {
  style?: React.CSSProperties,
  setFunc: (arg: string | User) => void,
  items: Estimation[] | User[] | Specialization[]
}

const DropdownList = ({ style, setFunc, items }: DropdownListProps) => {

  return (
    <div style={style} className='z-10 flex flex-col absolute top-full w-full bg-white rounded-t-none rounded-md'>
      <ul className='flex flex-col gap-2 list-none px-2 mb-2 min-h-1/2'>
        {items.map((item, i) => {
          if(typeof item === "string") {
            const spec = item[0] + item.slice(1).toLowerCase();
            return (
              <li key={i} onClick={() => setFunc(`${spec}`)} className='w-full py-1 border-b-2 border-stone-700 hover:bg-slate-400'>{spec}</li>
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