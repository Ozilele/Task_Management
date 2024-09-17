import React, { useCallback, useEffect, useState } from 'react'
import { FormMode, Specialization, TaskFormData, User } from '../types/project-types';
import { API_URL, specializations, standard_headers, task_states } from '../utils/helpers';
import AddTaskIcon from '@mui/icons-material/AddTask';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useDispatch } from 'react-redux';
import { changeFormMode, closeModal, resetTaskFormData, selectFormMode, selectTaskFormData } from '../features/appSlice';
import { useSelector } from 'react-redux';
import Overlay from './Overlay';
import DropdownInput from './DropdownInput';
import api from '../api';

type TaskModalWindowProps = {
  projectId: number,
  projectTeam: User[],
}

type TaskData = {
  title: string,
  content: string,
  state: string,
  currAssignedUsers: User[] | null;
}

const TaskModalWindow = ({ projectId, projectTeam }: TaskModalWindowProps) => {
  const [editTaskInfo, setEditTaskInfo] = useState({
    author: "",
    dateCreated: "",
  });
  const [taskData, setTaskData] = useState<TaskData>({
    title: "",
    content: "",
    state: "",
    currAssignedUsers: null,
  }); 
  const formMode = useSelector(selectFormMode);
  const savedTaskData = useSelector(selectTaskFormData);
  const dispatch = useDispatch();

  useEffect(() => {
    if(formMode === FormMode.EDIT) {
      setTaskData({
        title: savedTaskData!.title,
        content: savedTaskData!.content,
        state: savedTaskData!.state,
        currAssignedUsers: savedTaskData!.currAssignedUsers
      });
      // setEditTaskInfo({
      //   author: savedTaskData.createdBy.userId,
      //   dateCreated: savedTaskData.dateCreated,
      // });
    }
  }, []);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }
  
  const handleFormSubmission = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(formMode === FormMode.ADD) { // adding task
      try {
        let response = await api.post(`/projects/${projectId}/tasks/`, {
          title: taskData.title,
          content: taskData.content,
          state: taskData.state,
          assigned_to: taskData.currAssignedUsers,
        });
        console.log(response.data);
        if(response.status === 201) {
          dispatch(closeModal());
        }
      } catch(err) {
        console.error(err);
      }
    } else if(formMode === FormMode.EDIT) { // editing task
      try {
        let response = await api.put(`/api/projects/${projectId}/tasks/update/${savedTaskData?.task_id}/`, {
          title: taskData.title,
          content: taskData.content,
          state: taskData.state,
          assigned_to: taskData.currAssignedUsers
        });
        console.log(response.data);
        console.log(response.status);
        // if(response.status == 200) {
        //   dispatch(resetTaskFormData());
        //   dispatch(changeFormMode(FormMode.ADD));
        //   dispatch(closeModal());
        // }
      } catch(err) {
        console.error(err);
      }
    }
  }

  const setFunc = useCallback((property: string, item: string | User) => {
    setTaskData((prevData) => ({
      ...prevData,
      [property]: item
    }));
  }, []);

  return (
    <Overlay>
      <div onClick={(e) => e.stopPropagation()} className={`w-11/12 max-w-[800px] ${formMode == "EDIT" ? "h-auto" : "h-3/5" } bg-neutral-700 rounded-md`}>
        {formMode === FormMode.EDIT &&
          <div className='w-full px-3 py-2 flex flex-col items-end'>
            <span className='text-sm md:text-base'>Author: {editTaskInfo.author}</span>
            <span className='text-sm md:text-base'>Created: {editTaskInfo.dateCreated}</span>
          </div>
        }
        <form onSubmit={handleFormSubmission} className='relative w-full h-full px-3 md:px-5 py-4 md:py-6 flex flex-col items-center gap-5'>
          <div className='w-full max-w-[700px] flex flex-col gap-1 text-zinc-50'>
            <label htmlFor="task-title">Task Title</label>
            <input
              id='task-title'
              type='text'
              required
              className='w-full px-1.5 py-1.5 sm:px-2 sm:py-2 lg:py-2.5 lg:px-2.5 rounded-md text-lg border-none focus:outline-none focus:outline-2 focus:outline-violet-700 focus-visible:border-none bg-zinc-900'
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
              className='w-full px-1.5 py-1.5 sm:px-2 sm:py-2 lg:py-2.5 lg:px-2.5 rounded-md text-lg border-none focus:outline-none focus:outline-2 focus:outline-violet-700 focus-visible:border-none bg-zinc-900'
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
          />
          <DropdownInput
            property="currAssignedUsers"
            label="Assigned to"
            items={projectTeam}
            setFunc={setFunc}
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