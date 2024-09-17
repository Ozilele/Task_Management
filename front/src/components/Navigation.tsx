import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import Avatar from '@mui/material/Avatar';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import { deepPurple } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {

  const navigate = useNavigate();

  return (
    <nav className='w-full mt-4 flex justify-between items-center px-3 py-3'>
      <div className='flex items-center gap-2'>
        <DeveloperBoardIcon onClick={() => navigate("/")} className='!w-8 !h-8 !cursor-pointer'/>
        <h2 className='text-lg md:text-[22px] antialiased'>Manager</h2>
      </div>
      <div className='flex items-center lg:gap-4 md:gap-3 gap-2'>
        <ChatOutlinedIcon className='!w-8 !h-8 !cursor-pointer transition-opacity duration-300 hover:opacity-75'/>
        <NotificationsOutlinedIcon className='!w-8 !h-8 !cursor-pointer transition-opacity duration-300 hover:opacity-75'/>
        <Avatar className='!w-8 !h-8 !cursor-pointer' sx={{ bgcolor: deepPurple[500]}}>N</Avatar>
        <MenuIcon className='!w-8 !h-8 !cursor-pointer'/>
      </div>
    </nav>
  )
}

export default Navigation