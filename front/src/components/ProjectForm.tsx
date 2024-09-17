import AddTaskRoundedIcon from '@mui/icons-material/AddTaskRounded';
import axios from 'axios';
import ArrowRightAltRoundedIcon from '@mui/icons-material/ArrowRightAltRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../api';
import { useCallback, useRef, useState } from 'react';
import { specializations} from '../utils/helpers';
import { useDispatch } from 'react-redux';
import { closeModal } from '../features/appSlice';
import DropdownInput from './DropdownInput';
import { User } from '../types/project-types';

type ProjectUser = {
  name: string,
  specialization: string
}
type ProjectInfo = {
  title: string,
  description: string,
}

function ProjectForm() {
  const [inputs, setInputs] = useState<ProjectInfo>({
    title: "",
    description: "",
  });
  const [forms, setForms] = useState({
    projectNameForm: true,
    projectUsersForm: false,
  });
  const dispatch = useDispatch();

  return (
    <div onClick={(e) => e.stopPropagation()} className='relative w-11/12 sm:w-3/5 max-w-xl h-3/6 lg:h-56 max-h-[670px] bg-neutral-700 rounded-md px-3 py-2 md:py-4'>
      <div className='relative w-full h-full flex flex-col'>
        <div className='w-full flex items-center justify-between'>
          <div className='flex items-center gap-1'>
            <AddTaskRoundedIcon/>
            <h3 className='text-xl text-center'>New Project</h3>
          </div>
          <button className='bg-zinc-900 flex items-center px-1 py-1 rounded-full hover:opacity-80' onClick={() => dispatch(closeModal())}>
            <CloseRoundedIcon/>
          </button>
        </div>
        {forms.projectNameForm && <ProjectNameForm setInputs={setInputs} setForms={setForms} />}
        {forms.projectUsersForm && <UsersForm values={inputs} setForms={setForms} />}
      </div>
    </div>
  )
}

function ProjectNameForm({ setInputs, setForms }: { setInputs: (arg: ProjectInfo) => void, setForms: (prev: any) => void }) {
  const projectNameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const onNextBtnClick = () => {
    setForms({
      projectNameForm: false,
      projectUsersForm: true,
    });
  }
  return (
    <div className='w-full flex-1 my-2 flex flex-col gap-4'>
      <label htmlFor="title">Project Name</label>
      <input 
        ref={projectNameRef}
        type="text"
        id="title"
        autoComplete="false"
        required
        maxLength={100}
        name="projectName"
        className='w-full px-1.5 py-1.5 sm:px-2 sm:py-2 lg:py-2.5 lg:px-3 rounded-md text-lg focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500 bg-zinc-900'
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputs((prev) => ({...prev, title: e.target.value}))}
        placeholder="Title..."
        onBlur={() => projectNameRef.current?.blur()}
      />  
      <label htmlFor="description">Project Description</label>
      <textarea
        ref={descriptionRef} 
        autoComplete='false'
        id="description"
        rows={5}
        className='w-full px-1.5 py-1.5 sm:px-2 sm:py-2 rounded-md bg-zinc-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500'
        placeholder='Describe...'
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputs((prev) => ({...prev, description: e.target.value}))}
        onBlur={() => descriptionRef.current?.blur()}
      />
      <button 
        className='w-full max-w-[300px] mx-auto mt-auto flex items-center justify-center gap-1 px-2.5 py-3 bg-zinc-800 rounded-md hover:opacity-90'
        onClick={onNextBtnClick}
      >
        <span>Next</span>
        <ArrowRightAltRoundedIcon/>
      </button>
    </div>
  );
}

function UsersForm({ values, setForms }: { values: ProjectInfo, setForms: (prev: any) => void }) {
  const [userData, setUserData] = useState<ProjectUser>({
    name: "",
    specialization: "", 
  });
  const [users, setUsers] = useState<ProjectUser[]>([]);
  const dispatch = useDispatch();

  const resetInputs = () => {
    setUserData({
      name: "",
      specialization: "",
    });
  }
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value
      })
    );
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
    console.log(users);
    try {
      let response = await api.post("/api/admin/projects/", {
        title: values.title,
        description: values.description,
        team: users,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if(response.status === 201) {
        console.log(response.data);
        closeModal();
      }
    } catch(err) {
      if(axios.isAxiosError(err)) {
        console.log(err.response);
      } else {
        console.error(err);
      }
    } finally {
      resetInputs();
    }
  }

  const setFunc = useCallback((property: string, item: string | User) => {
    setUserData((prev) => ({
      ...prev,
      [property]: item,
    }));
  }, []);

  return (
    <div className='w-full h-full flex flex-col gap-4 lg:gap-6'>
      <div className='w-full max-w-[450px] mt-2 mx-auto flex flex-col gap-1'>
        <label htmlFor='username' className='text-lg'>Username</label>
        <input
          type='text'
          id="username"
          name="name"
          autoComplete='off'
          className='px-1.5 py-1.5 rounded-md text-xl focus:outline-none focus:border-violet-700 focus:ring-2 focus:ring-violet-700 bg-zinc-900' 
          value={userData.name}
          onChange={onInputChange}
        />
      </div>
      <DropdownInput
        property="specialization"
        style={{
          maxWidth: "450px",
          marginLeft: "auto",
          marginRight: "auto"
        }}
        label="Specialization"
        items={specializations}
        setFunc={setFunc}
      />
      <button 
        className='w-full my-2 max-w-[330px] mx-auto px-2 py-3 bg-appPurple rounded-md hover:opacity-90'
        onClick={addUserToProject}
      >
        Add User
      </button>
      <div className='w-full mt-1'>
        <h5 className='text-sm sm:text-base'>Added users: {users.map((user) => user.name + ", ")}</h5>
      </div>
      <div className='absolute bottom-1 sm:bottom-2 left-0 w-full px-2 sm:px-3 flex justify-between items-center'>
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
          Publish
        </button>
      </div>
    </div>
  );
}

export default ProjectForm;