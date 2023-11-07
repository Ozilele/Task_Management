import AddTaskRoundedIcon from '@mui/icons-material/AddTaskRounded';
import axios from 'axios';
import ArrowRightAltRoundedIcon from '@mui/icons-material/ArrowRightAltRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from 'react';
import { specializations, standard_headers } from '../utils/helpers';
import DropdownList from './DropdownList';

type ProjectUser = {
  name: string,
  specialization: string
}

function ProjectForm() {

  const [projectName, setProjectName] = useState<string>("");
  const [forms, setForms] = useState({
    projectNameForm: true,
    projectUsersForm: false,
  });

  return (
    <div onClick={(e) => e.stopPropagation()} className='relative max-w-xl w-11/12 sm:w-3/5 h-3/6 max-h-[650px] bg-neutral-700 rounded-md px-3 py-2 md:py-4'>
      <div className='w-full h-full'>
        <button className='absolute right-2 top-2'>
          <CloseRoundedIcon/>
        </button>
        <div className='flex items-center justify-center gap-1'>
          <AddTaskRoundedIcon/>
          <h3 className='text-lg'>New Project</h3>
        </div>
        {forms.projectNameForm && <ProjectNameForm setProjectName={setProjectName} setForms={setForms}/> }
        {forms.projectUsersForm && <UsersForm projectName={projectName} setForms={setForms}/> }
      </div>
    </div>
  )
}

function ProjectNameForm({ setProjectName, setForms }: { setProjectName: (arg: string) => void, setForms: (prev: any) => void }) {

  const onNextBtnClick = () => {
    setForms({
      projectNameForm: false,
      projectUsersForm: true,
    });
  }

  return (
    <div className='w-full flex flex-col gap-4'>
      <label>Project Name</label>
      <input 
        type="text"
        name="projectName"
        className='w-full px-1.5 py-1.5 sm:px-2 sm:py-2 lg:py-2.5 lg:px-2.5 rounded-t-md text-lg focus:outline-none focus:outline-2 focus:outline-violet-700 bg-zinc-900'
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProjectName(e.target.value)}
        placeholder="Project Name..."
      />  
      <button 
        className='w-full flex items-center justify-center gap-1 px-3 py-4'
        onClick={onNextBtnClick}
      >
        <span>Next</span>
        <ArrowRightAltRoundedIcon/>
      </button>
    </div>
  );
}

function UsersForm({ projectName, setForms }: { projectName: string, setForms: (prev: any) => void }) {

  const [userData, setUserData] = useState<ProjectUser>({
    name: "",
    specialization: "", 
  });
  const [users, setUsers] = useState<ProjectUser[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const resetInputs = () => {
    setUserData({
      name: "",
      specialization: "",
    });
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value
      }
    });
  }

  const addUserToProject = () => {
    setUsers((prev) => {
      const newUser: ProjectUser = {
        name: userData.name,
        specialization: userData.specialization.toUpperCase()
      }
      return [
        ...prev,
        newUser
      ];
    });
    resetInputs();
  }

  const handleAddProject = async () => {
    resetInputs();
    console.log(users)
    const response = await axios.post("https://task-manager-api-401408.lm.r.appspot.com/project", {
      name: projectName,  
      users: users
    }, standard_headers);
    if(response.status === 201) {
      // Add toast that project with users has been created
    }
  }

  return (
    <div className='w-full h-full flex flex-col gap-4 lg:gap-6'>
      <div className='w-full max-w-[450px] mt-2 mx-auto flex flex-col gap-1.5'>
        <label className='text-lg'>Username</label>
        <input
          className='px-1.5 py-1.5 rounded-md text-xl focus:outline-none focus:outline-2 focus:outline-violet-700 bg-zinc-900' 
          type='text'
          name="name"
          autoComplete='off'
          value={userData.name}
          onChange={onInputChange}
        />
      </div>
      <div onClick={() => setDropdownOpen(!dropdownOpen)} className='relative w-full max-w-[450px] flex items-center justify-between mb-3 mx-auto'>
        <input
          className='w-full px-1.5 py-1.5 rounded-md text-lg focus:outline-none focus:outline-2 focus:outline-violet-700 bg-zinc-900' 
          type='text'
          name="specialization"
          autoComplete='off'
          value={userData.specialization}
          onChange={onInputChange}
        />
        {!dropdownOpen && <ExpandLessIcon className='absolute right-1 m-auto'/>}
        {dropdownOpen && <ExpandMoreIcon className='absolute right-1 m-auto'/>}
        {dropdownOpen && 
          <DropdownList 
            style={{
              backgroundColor: "#18181B",
              borderColor: 'whitesmoke'
            }}
            setFunc={(item) => {
              setUserData({
                ...userData,
                specialization: item as string
              });
            }}
            items={specializations}
          />
        }
      </div>
      <button 
        className='w-full max-w-[400px] mx-auto px-2 py-3 bg-appPurple rounded-md hover:opacity-90'
        onClick={addUserToProject}
      >
        Add User
      </button>
      <div className='absolute bottom-2 left-0 w-full px-3 flex justify-between items-center'>
        <button 
          className='flex items-center bg-gray-500 px-2 py-2 rounded-md'
          onClick={() => setForms({ projectNameForm: true, projectUsersForm: false })}
        >
          <ArrowBackIcon/>
          <span>Back</span>
        </button>
        <button
          onClick={handleAddProject}
          className='bg-violet-500 px-2 py-2 rounded-md text-slate-200 hover:opacity-80'
        >
          Publish project
        </button>
      </div>
    </div>
  );
}

export default ProjectForm;