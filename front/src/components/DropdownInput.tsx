import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useEffect, useState } from 'react';
import DropdownList from './DropdownList';
import { Estimation, Specialization, User } from '../types/project-types';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { selectTaskFormData } from '../features/appSlice';

type DropdownInputProps = {
  property: string,
  label: string,
  items: Estimation[] | Specialization[] | User[]
  func: () => void,
}

function DropdownInput({ property, label, items, func }: DropdownInputProps) {

  const [value, setValue] = useState<string | User>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const taskFormData = useSelector(selectTaskFormData);
  const dispatch = useDispatch();

  useEffect(() => {
    if(taskFormData != null) {
      console.log(taskFormData);
      setValue(taskFormData[property]);
    }
  }, []);

  return (
    <div onClick={() => setDropdownOpen(!dropdownOpen)} className='w-full max-w-[700px] flex flex-col gap-1 text-zinc-50'>
      <label>{label}</label>
      <div className='w-full relative flex items-center justify-between'>
        <input
          type='text'
          className='w-full px-1.5 py-1.5 sm:px-2 sm:py-2 lg:py-2.5 lg:px-2.5 rounded-t-md text-lg focus:outline-none focus:outline-2 focus:outline-violet-700 bg-zinc-900'
          name="estimation"
          value={typeof(value) === "object" ? value.name : value}
        />
        {dropdownOpen && <ExpandMoreIcon className='absolute right-1 m-auto'/> }
        {!dropdownOpen && <ExpandLessIcon className='absolute right-1 m-auto'/> }
        {dropdownOpen && 
          <DropdownList
            style={{
              backgroundColor: "#18181B",
              borderColor: 'whitesmoke'
            }}  
            setFunc={(item) => {
              if(typeof item === "string") {
                setValue(item);
              }
              else if(typeof item === "object") {
                setValue(item);
              }
            }} 
            items={items}
          />
        }
      </div>
    </div>
  );
}

export default DropdownInput