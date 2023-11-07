import React, { useEffect, useState } from 'react'
import axios from 'axios';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import loader from "../assets/loader.svg";
import ProjectItem from '../components/ProjectItem';
import { Project } from '../types/project-types';
import { API_URL, standard_headers } from '../utils/helpers';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { openModal, selectModalOpen } from '../features/appSlice';
import ProjectModalWindow from '../components/ProjectModalWindow';

type ProjectInput = {
  project: string,
}

const Home = () => {

  const [projects, setProjects] = useState<Project[]>([]);
  const [projectInput, setProjectInput] = useState<ProjectInput>({
    project: ""
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const modalOpen = useSelector(selectModalOpen);
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get(`${API_URL}/project/user`, standard_headers).then((res) => {
      if(res.status === 200) {
        console.log(res);
        const projects = res.data.map((project: any) => {
          const newProject: Project = {
            id: project._id,
            name: project.projectCredentials.name,
            users: project.projectCredentials.users
          }
          return newProject;
        });
        console.log(projects);
        setProjects(projects);
      }
    }).catch(err => {
      console.log(err);
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectInput((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value
      }
    });
  }

  const handleAddProject = () => {
    dispatch(openModal());
  }

  return (
    <div className='w-full max-w-1200 my-7 lg:my-10 mx-auto h-full sm:flex sm:flex-col'>
      <div className='w-11/12 h-14 ml-auto mr-auto my-10 md:max-w-2xl px-3 py-5 md:px-4 md:py-5 flex justify-between items-center rounded-md bg-homeInput border-2 border-transparent focus-within:border-homeInputFocus'>
        <input
          type='text'
          name='project'
          className='w-full border-none outline-none bg-transparent text-lg'
          onChange={onInputChange}
          placeholder='Project Search...'
        />
        <SearchOutlinedIcon/>
      </div>
      <section className='w-11/12 h-full my-12 md:my-8 mx-auto flex flex-col items-center'>
        <div className='relative w-full mb-3 max-w-3xl flex justify-center'>
          <h3 className='mb-3 italic antialiased text-left text-2xl'>My Projects</h3>
          <button 
            className='absolute right-3 flex items-center gap-0.5 bg-appPurple px-2 py-2 rounded-md hover:opacity-80'
            onClick={handleAddProject}
          >
            <AddCircleRoundedIcon/>
            <span>Add Project</span>
          </button>
        </div>
        <div className='w-full min-h-[220px] flex-1 flex items-center justify-center gap-2'>
          {isLoading && <img className='w-11 h-11flex justify-center items-center' src={loader} alt='home_loader'/>}
          {!isLoading &&
            projects.map((project: Project) => {
              return (
                <ProjectItem
                  key={project.id}
                  id={project.id}
                  name={project.name}
                  users={project.users}
                />
              )
            })
          }
        </div>
      </section>
      {modalOpen && <ProjectModalWindow/> }
    </div>
  )
}

export default Home;