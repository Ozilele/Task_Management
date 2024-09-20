import React, { useEffect, useState } from 'react'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import loader from "../assets/loader.svg";
import api from '../api';
import axios from 'axios';
import { formatDate } from '../utils/helpers';
import ProjectItem from '../components/ProjectItem';
import { Project } from '../types/project-types';
import { useSelector, useDispatch } from 'react-redux';
import { openModal, selectModalOpen } from '../features/appSlice';
import ProjectModalWindow from '../components/ProjectModalWindow';

type ProjectInput = {
  project: string,
}

const Home = () => {
  const [assignedProjects, setAssignedProjects] = useState<Project[]>([]);
  const [projectInput, setProjectInput] = useState<ProjectInput>({
    project: ""
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const modalOpen = useSelector(selectModalOpen);
  const dispatch = useDispatch();

  useEffect(() => {
    getUserAssignedProjects();
  }, []);

  const getUserAssignedProjects = async () => {
    try {
      setIsLoading(true);
      let response = await api.get("/api/projects/");
      console.log(response.data);
      if(response.status === 200) {
        const assigned_projects = response.data.map((project: Project) => {
          const newProject: Project = {
            id: project.id,
            title: project.title,
            description: project.description,
            author: project.author,
            team: project.team,
            created_at: formatDate(project.created_at),
            last_modified: formatDate(project.last_modified)
          }
          return newProject;
        });
        setAssignedProjects(assigned_projects);
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

  const getUserCreatedProjects = async () => { // to test
    try {
      setIsLoading(true);
      let response = await api.get("/api/created_projects/");
      console.log(response.data);
      if(response.status === 200) {
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
          autoComplete='false'
          value={projectInput.project}
          className='w-full border-none outline-none bg-transparent text-lg'
          onChange={onInputChange}
          placeholder='Project Search...'
        />
        <SearchOutlinedIcon className='!cursor-pointer'/>
      </div>
      <section className='w-full h-full my-12 md:my-8 mx-auto flex flex-col justify-center items-center'>
        <div className='relative w-full mb-8 sm:mb-10 flex justify-center'>
          <h3 className='mb-3 italic antialiased text-left text-2xl'>My Projects</h3>
          <button 
            className='absolute right-2 sm:right-3 flex items-center gap-0.5 bg-appPurple px-2 py-2 rounded-md hover:opacity-80'
            onClick={handleAddProject}
          >
            <AddCircleRoundedIcon/>
            <span className='opacity-0 sm:opacity-100 hidden sm:block'>Add Project</span>
          </button>
        </div>
        <div className='w-full mx-auto min-h-[220px] flex flex-wrap sm:flex-row items-center justify-center gap-6 md:gap-4.5 lg:gap-5'>
          {isLoading && <img className='w-11 h-11 flex justify-center items-center' src={loader} alt='home_loader'/>}
          {!isLoading &&
            assignedProjects.map((project: Project) => {
              return (
                <ProjectItem
                  key={project.id}
                  data={project}
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