import React, { useCallback, useEffect, useState } from 'react'
import { FormMode, TaskData, User } from '../types/project-types';
import { task_states } from '../utils/helpers';
import AddTaskIcon from '@mui/icons-material/AddTask';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useDispatch } from 'react-redux';
import { changeFormMode, closeModal, reloadData, resetTaskFormData, selectFormMode, selectTaskFormData } from '../features/appSlice';
import { useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import Overlay from './Overlay';
import DropdownInput from './DropdownInput';
import api from '../api';
import { toast, ToastOptions } from 'react-toastify';
import axios from 'axios';

type TaskModalWindowProps = {
  projectId: number,
  projectTeam: User[],
}
const initialTaskDataState = {
  title: "",
  content: "",
  state: "",
  currAssignedUsers: null,
}
const toast_config: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  theme: "dark",
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
}

const TaskModalWindow = ({ projectId, projectTeam }: TaskModalWindowProps) => {
  const [taskData, setTaskData] = useState<TaskData>(initialTaskDataState); 
  const formMode = useSelector(selectFormMode);
  const savedTaskData = useSelector(selectTaskFormData);
  const dispatch = useDispatch();

  useEffect(() => {
    if(formMode === FormMode.EDIT) { // set data if mode is edit
      setTaskData({
        title: savedTaskData!.title,
        content: savedTaskData!.content,
        state: savedTaskData!.state,
        currAssignedUsers: savedTaskData!.currAssignedUsers
      });
    }
  }, []);

  console.log(taskData);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }
  const setFunc = useCallback((property: keyof TaskData, item: string | User, isRemoved: boolean = false) => {
    setTaskData((prev) => {
      const currentValue = prev[property];
      if(typeof item === "string") {
        return {
          ...prev,
          [property]: item
        };
      }
      if(Array.isArray(currentValue)) {
        if(isRemoved) {
          return {
            ...prev,
            [property]: currentValue.filter((user: User) => user.username !== item.username)
          };
        } else {
          return {
            ...prev,
            [property]: currentValue ? [...currentValue, item] : [item]
          };
        }
      }
      return {
        ...prev,
        [property]: [item]
      }
    });
  }, []);
  
  const handleFormSubmission = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(taskData.title.trim() === "" || taskData.content.trim() === "" || taskData.state === "" || taskData.currAssignedUsers == null) {
      return;
    }

    if(formMode === FormMode.ADD) {
      try {
        let response = await api.post(`/api/projects/${projectId}/tasks/`, {
          title: taskData.title,
          content: taskData.content,
          state: taskData.state,
          assigned_to: taskData.currAssignedUsers!.map((user) => user.id),
        });
        if(response.status === 201) {
          dispatch(closeModal());
          toast.success("Task added successfully!", toast_config); // toast and reloadData
          dispatch(reloadData());
        } else {
          setTaskData(initialTaskDataState);
          toast.error("Error adding task", toast_config);
        }
      } catch(err) {
        if(axios.isAxiosError(err)) {
          console.log(err.response);
        } else {
          console.error(err);
        }
        toast.error("Error adding task", toast_config);
      }
    } else if(formMode === FormMode.EDIT) { // editing task
      try {
        let response = await api.put(`/api/projects/${projectId}/tasks/${savedTaskData?.task_id}/`, {
          title: taskData.title,
          content: taskData.content,
          state: taskData.state,
          assigned_to: taskData.currAssignedUsers!.map(user => user.id),
        });
        console.log(response.status);
        if(response.status === 204) {
          dispatch(resetTaskFormData());
          dispatch(changeFormMode(FormMode.ADD));
          dispatch(closeModal());
          toast.success("Task updated!", toast_config); // toast and reloadData
          dispatch(reloadData());
        }
      } catch(err) {
        console.error(err);
      }
    }
  }

  return (
    <Overlay>
      <div onClick={(e) => e.stopPropagation()} className={`w-11/12 max-w-[800px] ${formMode == "EDIT" ? "h-auto" : "h-3/5" } bg-neutral-700 rounded-md`}>
        <form onSubmit={handleFormSubmission} className='relative w-full h-full px-3 md:px-5 py-4 md:py-6 flex flex-col items-center gap-5'>
          <div className='w-full max-w-[700px] flex flex-col gap-1 text-zinc-50'>
            <label htmlFor="task-title">Task Title</label>
            <input
              id='task-title'
              type='text'
              // required
              className='w-full px-1.5 py-1.5 sm:px-2 sm:py-2 lg:py-2.5 lg:px-2.5 rounded-md text-lg border-none focus:input-custom-focus bg-zinc-900'
              name="title"
              value={taskData.title}
              onChange={onInputChange}
            />
          </div>
          <div className='w-full max-w-[700px] flex flex-col gap-1 text-zinc-50'>
            <label htmlFor='task-content'>Task Content</label>
            <input
              id="task-content"
              type='text'
              // required
              className='w-full px-1.5 py-1.5 sm:px-2 sm:py-2 lg:py-2.5 lg:px-2.5 rounded-md text-lg border-none focus:input-custom-focus bg-zinc-900'
              name="content"
              value={taskData.content}
              onChange={onInputChange}
            />
          </div>
          <DropdownInput
            property="state"
            label="State"
            items={task_states}
            setFunc={setFunc}
            clearFunc={() => setTaskData(prev => ({
              ...prev,
              state: "",
            }))}
          />
          <DropdownInput
            multiple={true}
            property="currAssignedUsers"
            label="Assigned to"
            items={projectTeam}
            setFunc={setFunc}
            clearFunc={() => setTaskData(prev => ({
              ...prev,
              currAssignedUsers: null,
            }))}
          />
          <button
            type="submit"  
            className={`w-full max-w-[600px] ${formMode === FormMode.EDIT ? "mt-3" : "mt-auto"} mb-3 flex justify-center items-center gap-1 bg-violet-700 py-3.5 md:py-2.5 rounded-md hover:opacity-90`}
          >
            {formMode === FormMode.ADD && <AddTaskIcon />}
            {formMode === FormMode.EDIT && <EditRoundedIcon />}
            <span>{formMode === "ADD" ? "Add Task" : "Edit Task"}</span>
          </button>
        </form>
      </div>
    </Overlay>
  )
}

export default TaskModalWindow;