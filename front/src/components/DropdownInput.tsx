import { memo, useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DropdownList from './DropdownList';
import { TaskState, User } from '../types/project-types';
import { useSelector } from 'react-redux';
import { selectTaskFormData } from '../features/appSlice';

type DropdownInputProps = {
  property: string,
  style?: React.CSSProperties, 
  label: string,
  items: User[] | TaskState[],
  setFunc: (property: string, item: string | User) => void,
}

function DropdownInput({ property, style, label, items, setFunc }: DropdownInputProps) {
  const [value, setValue] = useState<string | User>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const savedTaskData = useSelector(selectTaskFormData);

  useEffect(() => {
    if(savedTaskData != null) { // EDIT MODE
      if(property === "currAssignedUsers") { // currAssignedUsers
        const usersList = items as User[];
        // const foundUser = usersList.find((user) => user.id === savedTaskData[property].id);
        // if(foundUser) {
        //   setValue(foundUser.username);
        //   setFunc(property, foundUser);
        // }
      } else { // state for example
        const providedData = savedTaskData[property];
        setValue(providedData);
        setFunc(property, providedData);
      }
    }
  }, []);

  return (
    <div 
      onClick={() => setDropdownOpen(!dropdownOpen)} 
      style={style && style}
      className='w-full max-w-[700px] flex flex-col gap-1 text-zinc-50'
    >
      <label>{label}</label>
      <div className='w-full relative flex items-center justify-between'>
        <input
          type="text"
          readOnly
          className='w-full px-1.5 py-1.5 sm:px-2 sm:py-2 lg:py-2.5 lg:px-2.5 rounded-t-md text-lg focus:outline-none focus:outline-2 focus:outline-violet-700 bg-zinc-900'
          name={property}
          value={typeof(value) === "object" ? value.username : value}
        />
        {dropdownOpen && <ExpandMoreIcon className='absolute right-1 m-auto' />}
        {!dropdownOpen && <ExpandLessIcon className='absolute right-1 m-auto' />}
        {dropdownOpen && 
          <DropdownList
            value={value}
            style={{
              backgroundColor: "#18181B",
              borderColor: 'whitesmoke'
            }}  
            setFunc={(item) => {
              if(typeof item === "string") {
                setValue(item);
              }
              else if(typeof item === "object") {
                setValue(item.username);
              }
              setFunc(property, item);
            }} 
            items={items}
          />
        }
      </div>
    </div>
  );
}

export default memo(DropdownInput);