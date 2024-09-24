import { Project } from '../types/project-types';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import { monthsShort } from '../utils/helpers';

type ProjectItemProps = {
  data: Project
}

const ProjectItem = ({ data }: ProjectItemProps) => {
  const random_id = uuidv4()
  const tasksForProjectLink = `/project/${random_id + data.id}`

  const formatDateForView = (date: string) => {
    let parts = date.split("-")
    let month = monthsShort[parseInt(parts[1].replace("0", "")) - 1];
    const day = parts[2].replace('0', '');
    return `${day} ${month}`
  }

  return (
    <article className='relative z-0 w-11/12 max-w-[450px] max-h-[450px] sm:w-45per md:w-5/12 lg:w-30per min-h-[250px] grid grid-rows-6 bg-zinc-700 px-3 py-2.5 md:px-4 md:py-3 rounded-md'>
      <a href={tasksForProjectLink} className='absolute w-full h-full top-0 let-0 bg-white opacity-0 z-10 transition-opacity duration-300 hover:opacity-10'/>
      <div className='w-full text-sm truncate'>
        <p className='truncate'>ID: {random_id + data.id}</p>
      </div>
      <div className='w-full row-span-4 flex flex-col'>
        <div className='w-full mb-5 lg:mb-0 row-span-3 text-base lg:truncate whitespace-pre-wrap break-words'>
          <h3 className='relative row-span-1 text-lg md:text-xl font-serif after:content-[""] after:block after:h-1 after:bg-slate-200'>{data.title}</h3>
          <p className='row-span-2 text-gray-400 line-clamp-5 lg:line-clamp-none whitespace-pre-wrap'>{data.description}</p>
        </div>
        <div className='w-full row-span-1 text-sm flex items-center gap-2'>
          <div className='flex items-center gap-1 rounded-md bg-customBlack py-1 px-1.5'>
            <CalendarMonthOutlinedIcon className='!cursor-pointer transition-opacity duration-300 hover:opacity-75'/>
            <label>{formatDateForView(data.created_at)}</label>   
          </div>
          <div className='flex items-center rounded-md bg-customBlack py-1 px-1.5'>
            <EditCalendarOutlinedIcon className='!cursor-pointer transition-opacity duration-300 hover:opacity-75'/>
            <label>{formatDateForView(data.last_modified)}</label>
          </div>
        </div>
      </div>
      <div className='w-full flex items-center justify-between row-span-1'>
        <button className='flex items-center justify-between gap-1 px-2 py-1 bg-appPurple hover:opacity-80 rounded-md'>
          <Link to={tasksForProjectLink}>View</Link>
          <ArrowForwardOutlinedIcon/>
        </button>
      </div>
    </article>
  )
}

export default ProjectItem;