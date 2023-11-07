import { Project, User } from '../types/project-types';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { Avatar } from '@mui/material';
import { Link } from 'react-router-dom';

const ProjectItem = ({ id, name, users }: Project) => {

  const tasksForProjectLink = `/project/${id}`

  return (
    <article className='w-11/12 md:w-9/12 max-w-2xl h-52 mt-3 mb-2 grid grid-rows-5 bg-zinc-700 rounded-md px-3 py-2 md:px-4 md:py-3'>
      <div className='w-full text-sm row-span-1 truncate ...'>
        <p className='truncate ...'>ID: {id}</p>
      </div>
      <div className='w-full text-2xl row-span-3 flex items-center'>
        <h3 className='relative font-serif after:content-[""] after:block after:h-1 after:bg-slate-100'>{name}</h3>
      </div>
      <div className='w-full flex items-center justify-between row-span-1'>
        <div className='w-2/4 truncate ...'>
          {users.map((user: User, i: number) => {
            return (
              <Avatar key={i} className='!w-7 !h-7 !text-homeInput'>{user.name[0].toUpperCase()}</Avatar>
            )
          })}
        </div>
        <button className='flex items-center justify-between gap-1 px-2 py-1 bg-appPurple rounded-md'>
          <Link to={tasksForProjectLink}>View</Link>
          <ArrowForwardOutlinedIcon/>
        </button>
      </div>
    </article>
  )
}

export default ProjectItem;