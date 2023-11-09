import axios from 'axios';
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { API_URL, my_columns, standard_headers } from '../utils/helpers';
import { MyTask, Task, User } from '../types/project-types';
import { DragDropContext } from 'react-beautiful-dnd';
import AddIcon from '@mui/icons-material/Add';
import TaskModalWindow from '../components/TaskModalWindow';
import { motion } from 'framer-motion';
import TableColumn from '../components/TableColumn';
import { useSelector } from 'react-redux';
import { selectModalOpen, toggleModal } from '../features/appSlice';
import { useDispatch } from 'react-redux';

const Project = () => {
  const { id }= useParams(); // getting id of the project
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [columns, setColumns] = useState(my_columns);
  const modalOpen = useSelector(selectModalOpen);
  const dispatch = useDispatch();

  const [users, setUsers] = useState<User[]>([]);
  
  console.log(columns);
  console.log(users);

  useEffect(() => {
    setIsLoading(true);
    async function getData() {
      const API_URLS = [`${API_URL}/project/${id}/task`, `${API_URL}/project/${id}`];
      const promises = API_URLS.map((apiUrl) => {
        return axios.get(apiUrl, standard_headers)
          .then((res) => {
            return res.data;
          })
          .catch(err => {
            console.error(err);
            return err;
          });
      });
      const allData = await Promise.all(promises);
      allData.map((data) => {
        if(data.projectCredentials) {
          setUsers(data.projectCredentials.users);
        } else {
          const myTasks: MyTask[] = data.map((task: Task) => {
            const date = new Date(task.createdAt);
            const formattedDate = date.toLocaleString();
            const myTask = {
              id: task._id,
              createdBy: task.createdBy,
              dateCreated: formattedDate,
              state: task.state,
              projectId: task.projectId,
              data: {
                name: task.credentials.name,
                estimation: task.credentials.estimation,
                specialization: task.credentials.specialization,
                assignedTo: task.credentials.assignedTo
              }
            }
            return myTask;
          });
          const updatedColumns = { ...columns };
          myTasks.forEach((task) => {
            for(const columnId in updatedColumns) {
              const column = updatedColumns[columnId];
              if(column.title === task.state) {
                column.tasks.push(task);
                break;
              }
            }
          });
          setColumns(updatedColumns);
        }
      });
    }
    getData();
  }, []);


  const handleOnDragEnd = (result) => {
    const draggableId = result.draggableId;
    if(!result.destination) {
      return;
    }
    const { source, destination } = result;
    if(source.droppableId !== destination.droppableId) { // dragging between columns
      const srcColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const srcTasks = [...srcColumn.tasks];
      const destTasks = [...destColumn.tasks];
      const [removed] = srcTasks.splice(source.index, 1);
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
    <div className='relative w-full max-w-1200 mx-auto h-full mt-3 px-3'>
      <div className='mt-10 w-full max-w-24 px-1.5 flex items-center gap-2'>
        <button className='px-2.5 py-2.5 hover:opacity-80 bg-projectBg rounded-md'>All Tasks</button>
        <button className='px-2.5 py-2.5 hover:opacity-80 text-gray-300 bg-projectBg rounded-md'>My Tasks</button>
      </div>
      <motion.button
        whileHover={{
          scale: 1.1,
        }}
        whileTap={{ scale: 0.9 }}
        onClick={() => dispatch(toggleModal(true))}
        className='fixed w-14 h-14 lg:w-[68px] lg:h-[68px] bottom-3.5 right-3.5 lg:right-4 lg:bottom-4 text-white bg-appPurple rounded-full'
      >
        <AddIcon/>
      </motion.button>
      <div className='w-full max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 lg:gap-5 my-12 px-1'>
        <DragDropContext onDragEnd={result => handleOnDragEnd(result)}>
          {Object.entries(columns).map(([id, column]) => {
            return (
              <TableColumn
                key={id}
                id={id}
                title={column.title}
                tasks={column.tasks}
              />
            )
          })}
        </DragDropContext>
      </div>
      {modalOpen && <TaskModalWindow projectId={id} users={users}/>}
    </div>
  )
}

export default Project;