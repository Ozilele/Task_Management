import { Project, User } from '../types/project-types';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { Avatar } from '@mui/material';
import { Link } from 'react-router-dom';

type ProjectItemProps = {
  data: Project
}

const ProjectItem = ({ data }: ProjectItemProps) => {

  const tasksForProjectLink = `/project/${data.id}`
  return (
    <article className='w-11/12 max-w-[450px] sm:w-45per md:w-5/12 lg:w-30per min-h-[250px] grid grid-rows-5 bg-zinc-700 px-3 py-2.5 md:px-4 md:py-3 rounded-md'>
      <div className='w-full text-sm row-span-1 truncate ...'>
        <p className='truncate ...'>ID: {data.id}</p>
      </div>
      <div className='w-full text-xl md:text-2xl row-span-3 flex items-center'>
        <h3 className='relative font-serif after:content-[""] after:block after:h-1 after:bg-slate-100'>{data.title}</h3>
      </div>
      <div className='w-full flex items-center justify-between row-span-1'>
        {/* <div className='w-2/4 flex items-center gap-1 truncate ...'>
          {users.map((user: User, i: number) => {
            return (
              <Avatar key={i} className='!w-7 !h-7 !text-homeInput'>{user.name[0].toUpperCase()}</Avatar>
            )
          })}
        </div> */}
        <button className='flex items-center justify-between gap-1 px-2 py-1 bg-appPurple hover:opacity-80 rounded-md'>
          <Link to={tasksForProjectLink}>View</Link>
          <ArrowForwardOutlinedIcon/>
        </button>
      </div>
    </article>
  )
}

export default ProjectItem;