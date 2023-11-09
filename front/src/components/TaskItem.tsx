import { DraggableProvidedDraggableProps } from "react-beautiful-dnd";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ModeEditOutlineRoundedIcon from '@mui/icons-material/ModeEditOutlineRounded';
import { IconButton } from "@mui/material";
import { useDispatch } from "react-redux";
import { changeFormMode, openModal, setTaskFormData } from "../features/appSlice";
import { FormMode } from "../types/project-types";

type TaskItemProps = {
  taskId: string,
  reference: any,
  dragProps: DraggableProvidedDraggableProps,
  dragHandle: any,
  data: {
    name: string,
    estimation: string,
    specialization: string,
    assignedTo: {
      userId: string,
    },
    createdBy: {
      userId: string,
    },
    dateCreated: string
  }
}

const TaskItem = ({ taskId, reference, dragProps, dragHandle, data }: TaskItemProps) => {
  const dispatch = useDispatch();

  const editTask = async () => {
    dispatch(changeFormMode(FormMode.EDIT));
    dispatch(setTaskFormData({ // Aplying data for form in the modal window
      name: data.name,
      taskId,
      estimation: data.estimation,
      specialization: data.specialization,
      assignedTo: data.assignedTo,
      dateCreated: data.dateCreated,
      createdBy: data.createdBy,
    }));
    dispatch(openModal());
  }

  return (
    <div
      ref={reference}
      {...dragProps}
      {...dragHandle}
      className={`w-full flex flex-col my-2 bg-slate-200 text-black rounded-md px-1 min-h-[115px] lg:min-h-[140px]`}
    >
      <div className="flex-1 flex flex-row-reverse items-center gap-1 sm:gap-1.5">
        <IconButton onClick={editTask} className="!px-1 !py-1 md:!py-1.5">
          <ModeEditOutlineRoundedIcon className="!w-6 !h-6 md:!w-7 md:!h-7"/>
        </IconButton>
        <IconButton className="!px-1 !py-1 md:!py-1.5">
          <DeleteRoundedIcon className="!text-red-600 !w-6 !h-6 md:!w-7 md:!h-7"/>
        </IconButton>
      </div>
      <div className="flex-3 flex items-center pl-1">
        <h3 className="text-lg lg:text-xl">{data.name}</h3>
      </div>
      <div className="flex-1 flex gap-1 pl-1 items-center">
        <span className="text-md">Estimation:</span>
        <h4>{data.estimation}</h4>
      </div>
    </div>
  )
}

export default TaskItem;