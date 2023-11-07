import React, { useEffect, useState } from 'react'
import { Specialization, TaskItem, User } from '../types/project-types';
import { API_URL, fibNumbers, specializations, standard_headers } from '../utils/helpers';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DropdownList from './DropdownList';
import AddTaskIcon from '@mui/icons-material/AddTask';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { closeModal, resetTaskFormData, selectFormMode, selectTaskFormData } from '../features/appSlice';
import { useSelector } from 'react-redux';
import Overlay from './Overlay';
import DropdownInput from './DropdownInput';

type TaskModalWindowProps = {
  projectId: string | undefined,
  users: User[],
}

const TaskModalWindow = ({ projectId, users }: TaskModalWindowProps) => {
  const [inputs, setInputs] = useState({
    name: "",
  });
  const [editTaskInfo, setEditTaskInfo] = useState({
    author: "",
    dateCreated: "",
  });
  const [taskData, setTaskData] = useState({
    estimation: "",
    specialization: "",
    assignTo: {
      id: "",
      name: "",
      specialization: Specialization.NONE
    }
  }); 

  const [assignedUser, setAssignedUser] = useState<User>({
    id: "",
    name: "",
    specialization: Specialization.NONE
  });
  const formMode = useSelector<string>(selectFormMode);
  const taskFormData = useSelector(selectTaskFormData);
  const dispatch = useDispatch();

  useEffect(() => {
    if(taskFormData !== null) {
      console.log(taskFormData);
      setInputs((prev) => ({
          ...prev,
          name: taskFormData.name,
        }
      ));
      setEditTaskInfo({
        author: taskFormData.createdBy.userId,
        dateCreated: taskFormData.dateCreated,
      });
      setEstimation(taskFormData.estimation);
      setSpecialization(taskFormData.specialization);
      dispatch(resetTaskFormData());
    }
  }, []);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value
      }
    });
  }

  const onDropdownChange = (property: string) => {
    setDropdownsOpen((prev) => {
      return {
        ...prev,
        [property]: !prev[property]
      };
    });
  }
  
  const handleFormSubmission = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    // const time = Date.now();
    if(formMode === "ADD") {
      try {
        const response = await axios.post(`${API_URL}/project/${projectId}/task`, {
          name: inputs.name,
          assignedTo: {
            userId: assignedUser.id
          },
          estimation,
          specialization
        }, standard_headers);
        console.log(response);
        if(response.status === 201) {
          dispatch(closeModal());
        }
      } catch(err) {
        console.error(err);
      }
    } else if(formMode === "EDIT") {
      try {
        const response = await axios.put(`${API_URL}/project/${projectId}/task/${taskId}`, {}, standard_headers);
        console.log(response);
      } catch(err) {
        console.error(err);
      }
    }
  }

  return (
    <Overlay>
      <div onClick={(e) => e.stopPropagation()} className={`w-11/12 max-w-[800px] ${formMode == "EDIT" ? "h-auto" : "h-3/5" } bg-neutral-700 rounded-md`}>
        {formMode === "EDIT" &&
          <div className='w-full px-3 py-2 flex flex-col items-end'>
            <span className='text-sm md:text-base'>Author: {editTaskInfo.author}</span>
            <span className='text-sm md:text-base'>Created: {editTaskInfo.dateCreated}</span>
          </div>
        }
        <form onSubmit={handleFormSubmission} className='relative w-full h-full px-3 md:px-5 py-4 md:py-6 flex flex-col items-center gap-5'>
          <div className='w-full max-w-[700px] flex flex-col gap-1 text-zinc-50'>
            <label>Task Name</label>
            <input
              type='text'
              className='w-full px-1.5 py-1.5 sm:px-2 sm:py-2 lg:py-2.5 lg:px-2.5 rounded-md text-lg border-none focus:outline-none focus:outline-2 focus:outline-violet-700 focus-visible:border-none bg-zinc-900'
              name="name"
              value={inputs.name}
              onChange={onInputChange}
            />
          </div>
          <DropdownInput
            property = "estimation"
            label="Estimation"
            items={fibNumbers}
          />
          <DropdownInput
            label='Assign to'
            items={users}
          />
          <DropdownInput
            property='specialization'
            label='Task Specialization'
            items={specializations}
          />
          <button
            type="submit"  
            className={`w-full max-w-[600px] ${formMode === "EDIT" ? "mt-3" : "mt-auto"} mb-3 flex justify-center items-center gap-1 bg-violet-700 py-3.5 md:py-2.5 rounded-md hover:opacity-90`}
          >
            {formMode === "ADD" && <AddTaskIcon/>}
            {formMode === "EDIT" && <EditRoundedIcon/>}
            <span>{formMode === "ADD" ? "Add Task" : "Edit Task"}</span>
          </button>
        </form>
      </div>
    </Overlay>
  )
}

export default TaskModalWindow