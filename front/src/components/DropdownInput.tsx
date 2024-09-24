import { memo, useEffect, useRef, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CloseIcon from '@mui/icons-material/Close';
import DropdownList from './DropdownList';
import { TaskData, TaskState, User } from '../types/project-types';
import { useSelector } from 'react-redux';
import { selectTaskFormData } from '../features/appSlice';

type MultiSelectDropdown = {
  multiple: true,
  items: User[],
}
type SingleSelectDropdown = {
  multiple?: false,
  items: TaskState[],
}
type DropdownInputProps = {
  property: keyof TaskData,
  style?: React.CSSProperties, 
  label: string,
  setFunc: (property: keyof TaskData, item: string | User, isRemoved: boolean) => void,
  clearFunc: () => void,
} & (SingleSelectDropdown | MultiSelectDropdown);

function DropdownInput({ multiple, property, style, label, items, setFunc, clearFunc }: DropdownInputProps) {
  const [value, setValue] = useState<string | User[] | undefined>(multiple ? [] : undefined);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const savedTaskData = useSelector(selectTaskFormData);

  useEffect(() => {
    if(savedTaskData != null) { // EDIT MODE
      if(property === "currAssignedUsers") {
        const data = savedTaskData['currAssignedUsers'];
        setValue(data);
      } else {
        const providedData = savedTaskData[property];
        setValue(providedData);
      }
    }
  }, []);
  
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if(e.target != containerRef.current) return;
      switch(e.code) {
        case "Enter":
        case "Space":
          setDropdownOpen(prev => !prev);
          break;
        case "ArrowUp":
        case "ArrowDown":
          if(!dropdownOpen) {
            setDropdownOpen(true);
            break;
          }
          // const newValue = highlightedIndex
          break;
        case "Escape":
          setDropdownOpen(false);
          break;
      }
    }
    containerRef.current?.addEventListener("keydown", handler);

    return () => {
      containerRef.current?.removeEventListener("keydown", handler);
    }
  }, [dropdownOpen, items]);

  const selectOption = (item: User) => {
    setValue((prev) => {
      if(Array.isArray(prev)) {
        if(prev.some(user => user.username === item.username)) {
          return prev.filter(user => user.username !== item.username); // removing the item
        } else {
          return prev ? [...prev, item] : [item];
        }
      }
    });
  }

  return (
    <div
      key={property}
      style={style && style}
      className='w-full h-fit max-w-[700px] flex flex-col gap-1 text-zinc-50'
    >
      <label>{label}</label>
      <div
        ref={containerRef}
        tabIndex={0}
        onBlur={() => setDropdownOpen(false)}
        onClick={() => setDropdownOpen(prev => !prev)}
        className='w-full relative flex items-center gap-1 bg-zinc-900 px-1.5 py-1.5 sm:px-2 sm:py-2 lg:py-2.5 lg:px-2.5 rounded-sm focus:input-custom-focus'
      >
        <span className='flex-grow flex gap-2 flex-wrap text-lg'>{multiple ? (
          Array.isArray(value) ? value?.map(v => (
          <button 
            className='bg-violet-600 px-2 py-1 rounded-sm'
            key={v.username} 
            onClick={e => {
              e.stopPropagation();
              setFunc(property, v, true);
              selectOption(v);
            }}>
            {v.username}
          </button>
          )) : null
          ) : (value as string)}
        </span>
        <button
          type="button" 
          onClick={(e) => {
            e.stopPropagation();
            if(multiple) {
              setValue([]);
            } else {
              setValue(undefined);  
            }
            clearFunc();
          }}
        >
          <CloseIcon className='!w-6 !h-6 cursor-pointer'/>
        </button>
        <div className='w-0.5 self-stretch bg-gray-500'></div>
        {dropdownOpen && <ExpandMoreIcon className="!w-6 !h-6 cursor-pointer"/>}
        {!dropdownOpen && <ExpandLessIcon className="!w-6 !h-6 cursor-pointer"/>}
        <DropdownList
          multiple={multiple ? true : false}
          value={value}
          style={{
            backgroundColor: "#18181B",
            borderColor: 'whitesmoke'
          }}  
          isOpen={dropdownOpen}
          onChange={(item) => {
            if(typeof item === "string") {
              setValue(item);
              setFunc(property, item, false); // set value in parent
            }
            else if(typeof item === "object") {
              if(Array.isArray(value)) {
                if(value?.some(user => user.username === item.username)) {
                  setFunc(property, item, true);
                } else {
                  setFunc(property, item, false);
                }
              }
              selectOption(item);
            }
            setDropdownOpen(false); // close dropdown
          }} 
          items={items}
        />
      </div>
    </div>
  );
}

export default memo(DropdownInput);