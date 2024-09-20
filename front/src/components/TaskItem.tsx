import { DraggableProvidedDraggableProps } from "react-beautiful-dnd";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ModeEditOutlineRoundedIcon from '@mui/icons-material/ModeEditOutlineRounded';
import { IconButton } from "@mui/material";
import { useDispatch } from "react-redux";
import { changeFormMode, openModal, reloadData, setTaskFormData } from "../features/appSlice";
import { FormMode, Task, User } from "../types/project-types";
import { toast, ToastOptions } from 'react-toastify';
import Avatar from '@mui/material/Avatar';
import api from "../api";

type TaskItemProps = {
  snapshot: any,
  taskId: number,
  reference: any,
  dragProps: DraggableProvidedDraggableProps,
  dragHandle: any,
  task: Task,
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
      currAssignedUsers: task.assigned_to as User[],
    }));
    dispatch(openModal());
  }

  const deleteTask = async () => {
    try {
      let response = await api.delete(`/api/projects/${task.project}/tasks/${taskId}/`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if(response.status === 204) {
        toast.success("Task deleted.", toast_config);
        dispatch(dispatch(reloadData()));
      } else {
        toast.error("Task not deleted successfully.", toast_config);
      }
    } catch(error) {
      console.error(error);
      alert('Failed to delete the note.');
    }
  }

  function stringToColor(string: string) {
    let hash = 0;
    let i;
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  }
  
  return (
    <div
      ref={reference}
      {...dragProps}
      {...dragHandle}
      className={`relative w-full select-none flex flex-col my-2 pb-2.5 text-gray-200 rounded-md px-1 min-h-[115px] lg:min-h-[140px] border-2 border-transparent transition ease-in-out delay-100 duration-300 ${snapshot.isDragging ? "bg-taskSelected border-white" : "bg-blacking"}`}
    >
      {/* absolute top-1 right-1 */}
      <div className="flex-1 flex flex-row-reverse items-center gap-1 sm:gap-1.5">
        <IconButton onClick={editTask} className="!px-0.5 !py-0.5">
          <ModeEditOutlineRoundedIcon className="!text-gray-100 !w-4 !h-4 md:!w-5 md:!h-5"/>
        </IconButton>
        <IconButton onClick={deleteTask} className="!px-0.5 !py-0.5">
          <DeleteRoundedIcon className="!text-red-700 !w-4 !h-4 md:!w-5 md:!h-5"/>
        </IconButton>
      </div>
      <div className="flex-1 flex flex-col justify-center pl-1 gap-1.5 px-2">
        <h3 className="text-base lg:text-lg">{task.title}</h3>
        <p className="text-sm lg:text-base text-slate-300">{task.content}</p>
      </div>
      <div className="mt-4 flex-1 flex items-center gap-2 px-1">
        {task.assigned_to.map((user: User, ind) => {
          return (
            <Avatar
              alt={user.email}
              key={ind} 
              variant="rounded"
              sx={{ width: 28, height: 28, bgcolor: stringToColor(user.username) }}>{user.username[0].toLocaleUpperCase()}
            </Avatar>
          );
        })}
      </div>
    </div>
  );
}

export default TaskItem;