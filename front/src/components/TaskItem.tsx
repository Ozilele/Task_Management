import { DraggableProvidedDraggableProps } from "react-beautiful-dnd";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ModeEditOutlineRoundedIcon from '@mui/icons-material/ModeEditOutlineRounded';
import { IconButton } from "@mui/material";
import { useDispatch } from "react-redux";
import { changeFormMode, openModal, setTaskFormData } from "../features/appSlice";
import { FormMode, Task } from "../types/project-types";
import api from "../api";

type TaskItemProps = {
  snapshot: any,
  taskId: number,
  reference: any,
  dragProps: DraggableProvidedDraggableProps,
  dragHandle: any,
  task: Task,
}

const TaskItem = ({ snapshot, taskId, reference, dragProps, dragHandle, task }: TaskItemProps) => {
  const dispatch = useDispatch();

  const editTask = async () => { // func to edit the task details in given project
    dispatch(changeFormMode(FormMode.EDIT));
    dispatch(setTaskFormData({
      task_id: task.id,
      title: task.title,
      content: task.content,
      state: task.state,
      project_id: task.project,
      currAssignedUsers: task.assigned_to
    }));
    dispatch(openModal());
  }

  const deleteTask = async () => {
    try {
      let response = await api.put(`/api/projects/${task.project}/tasks/delete/${taskId}/`, {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.status);
      console.log(response.data);
      if(response.status === 204) {
        alert('Note was deleted');
      }
    } catch(error) {
      console.error(error);
      alert('Failed to delete the note.');
    }
  }
  
  return (
    <div
      ref={reference}
      {...dragProps}
      {...dragHandle}
      className={`w-full select-none flex flex-col my-2 text-gray-200 rounded-md px-1 min-h-[115px] lg:min-h-[140px] border-2 border-transparent transition ease-in-out delay-100 duration-300 ${snapshot.isDragging ? "bg-taskSelected border-white" : "bg-blacking"}`}
    >
      <div className="flex-1 flex flex-row-reverse items-center gap-1 sm:gap-1.5">
        <IconButton onClick={editTask} className="!px-1 !py-1 md:!py-1.5">
          <ModeEditOutlineRoundedIcon className="!text-gray-100 !w-6 !h-6 md:!w-7 md:!h-7"/>
        </IconButton>
        <IconButton onClick={deleteTask} className="!px-1 !py-1 md:!py-1.5">
          <DeleteRoundedIcon className="!text-red-700 !w-6 !h-6 md:!w-7 md:!h-7"/>
        </IconButton>
      </div>
      <div className="flex-3 flex items-center pl-1">
        <h3 className="text-lg lg:text-xl">{task.title}</h3>
      </div>
      <div className="flex-1 flex gap-1 pl-1 items-center">
        <span className="text-md">Estimation:</span>
        <h4>{task.state}</h4>
      </div>
    </div>
  )
}

export default TaskItem;