import axios from 'axios';
import { memo, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { my_columns, tasksOption, toast_config, viewOption } from '../utils/helpers';
import { CurrTaskOption, MyTask, Task, User } from '../types/project-types';
import { DragDropContext } from 'react-beautiful-dnd';
import AddIcon from '@mui/icons-material/Add';
import TaskModalWindow from '../components/TaskModalWindow';
import Column from '../components/Column';
import api from '../api';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { reloadData, selectDataToBeReload, selectModalOpen, toggleModal } from '../features/appSlice';
import { toast, ToastContainer } from 'react-toastify';

type SelectedView = "Grid" | "List" | "Board"
type SelectedOptions = {
  taskOption: CurrTaskOption,
  viewOption: SelectedView
}

const Project = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [columns, setColumns] = useState(my_columns);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({
    taskOption: "All Tasks",
    viewOption: "Grid"
  });
  const dispatch = useDispatch();
  const isModalOpen = useSelector(selectModalOpen);
  const dataToReload = useSelector(selectDataToBeReload);
  const projectID = id ? parseInt(id[id?.length - 1]) : 0;

  useEffect(() => {
    switch(selectedOptions.taskOption) {
      case "All Tasks": 
        getTasks("tasks/");
        break;
      case "My Tasks":
        getTasks("assigned-tasks/");
        break;
      case "Created":
        getTasks("created-tasks/");
        break;
    }
  }, [dataToReload]);

  const insertTasksInColumn = (tasks: MyTask[]) => {
    const updatedColumns = { ...columns };
    for(const columnId in updatedColumns) {
      updatedColumns[columnId].tasks = [] // resetting column tasks before applying new data 
    }
    tasks.forEach((task: MyTask) => {
      for(const columnId in updatedColumns) {
        const column = updatedColumns[columnId];
        if(column.title === task.state) {
          column.tasks.push(task); // add task to the appropriate column
          break;
        }
      }
    });
    setColumns(updatedColumns);
  }

  // /api/${projectID}/tasks/
  const getTasks = async (apiRoute: string) => {
    setIsLoading(true);
    try {
      let response = await api.get(`/api/projects/${projectID}/${apiRoute}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);

      if(response.status === 200) { // get assigned tasks 
        let projectUsers: User[];
        if(apiRoute === "tasks/") { // all tasks
          projectUsers = response.data.project_team.map((user: User) => {
            const project_assigned_User: User = {
              id: user.id,
              username: user.username,
              email: user.email,
            }
            return project_assigned_User;
          });
          setUsers(projectUsers);
        } 
        const assignedTasks: MyTask[] = response.data.tasks.map((task: Task) => {
          const assigned_Task: MyTask = {
            id: task.id,
            title: task.title,
            content: task.content,
            state: task.state,
            author: task.author,
            assigned_to: (task.assigned_to as number[]).map((userId: number) => {
              let user = apiRoute === "tasks/" ? projectUsers.find((user) => user.id === userId) : users.find(user => user.id === userId);
              return user || {} as User
            }),
            project: task.project
          }
          return assigned_Task;
        });
        insertTasksInColumn(assignedTasks);
      } 
      else if(response.status === 404) {
        console.log("Not able to find the tasks");
      }
    } catch(error) {
      if(axios.isAxiosError(error)) {
        console.log(error.response);
      } else {
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  }
  
  const onTaskChange = (task_option: string, api_route: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      taskOption: task_option as CurrTaskOption
    }));
    getTasks(api_route);
  }
  const onViewChange = (view_option: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      viewOption: view_option as SelectedView
    }));
  }

  const handleOnDragEnd = (result: any) => {
    if(!result.destination) {
      return;
    }
    const { source, destination } = result;
    if(source.droppableId !== destination.droppableId) { // dragging between columns
      const srcColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const destTaskState = destColumn.title;
      const srcTasks = [...srcColumn.tasks];
      const destTasks = [...destColumn.tasks];
      const [removed] = srcTasks.splice(source.index, 1); // removed is actual task that was dragged 
      destTasks.splice(destination.index, 0, removed);

      setColumns((prev) => {
        return {
          ...prev,
          [source.droppableId]: {
            ...srcColumn,
            tasks: srcTasks
          },
          [destination.droppableId]: {
            ...destColumn,
            tasks: destTasks
          }
        }
      });
      api.put(`/api/projects/${projectID}/tasks/${removed.id}/`, {
        state: destTaskState
      })
      .then(response => {
        if(response.status === 204) {
          toast.success("Task updated!", toast_config); // toast and reloadData
          dispatch(reloadData());
        } else {
          toast.error("Error updating task", toast_config);
        }
      })
      .catch((err) => {
        if(axios.isAxiosError(err)) {
          console.log(err.response);
        } else {
          console.error(err);  
        }
        toast.error("Error updating task", toast_config);
      });
    } else { // Dragging in the same column
      const column = columns[source.droppableId];
      const columnTasks = [...column.tasks];
      const [draggableTask] = columnTasks.splice(source.index, 1);
      columnTasks.splice(destination.index, 0, draggableTask); // inserting draggable task into new position
      setColumns((prev) => {
        return {
          ...prev,
          [source.droppableId]: {
            ...column,
            tasks: columnTasks
          }
        }
      });
    }
  }

  return (
    <>
      <div className='relative w-full max-w-7xl mx-auto h-full mt-3 px-3'>
        <div className='mt-10 w-full max-w-24 px-1.5 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            {tasksOption.map((task, i) => {
              return (
                <button
                  key={i}
                  onClick={(_) => onTaskChange(task.name, task.route)} 
                  className={`px-2.5 py-2.5 rounded-md ${selectedOptions.taskOption === task.name ? "bg-taskSelected text-slate-100" : "bg-projectBg text-gray-300"} transition-opacity duration-300 hover:opacity-80`}>
                  {task.name}
                </button>
              )
            })}
          </div>
          <div className='flex items-center gap-1'>
            {viewOption.map((view, i) => {
              return (
                <button
                  key={i}
                  onClick={(_) => onViewChange(view.name)}
                  className={`${selectedOptions.viewOption === view.name ? "bg-registerBlue text-slate-200": "bg-zinc-950"} flex items-center gap-1 px-2 py-1.5 rounded-md transition-opacity duration-300 hover:opacity-80`}
                >
                  {view.icon && <view.icon/>}
                  <span>{view.name}</span>
                </button>
              )
            })}
          </div>
        </div>
        <motion.button
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{ scale: 0.9 }}
          onClick={() => dispatch(toggleModal(true))}
          className='fixed w-14 h-14 lg:w-[68px] lg:h-[68px] bottom-3.5 right-3.5 lg:right-4 lg:bottom-4 text-white bg-appPurple rounded-full'
        >
          <AddIcon/>
        </motion.button>
        <div className='w-full max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 lg:gap-5 my-12 px-1'>
          <DragDropContext 
            onDragEnd={result => handleOnDragEnd(result)}
          >
            {Object.entries(columns).map(([id, column], ind) => {
              return (
                <Column
                  key={ind}
                  column_id={id}
                  title={column.title}
                  tasks={column.tasks}
                />
              )
            })}
          </DragDropContext>
        </div>
        {isModalOpen && <TaskModalWindow projectId={projectID} projectTeam={users}/>}
      </div>
      <ToastContainer/>
    </>
  )
}

export default memo(Project);