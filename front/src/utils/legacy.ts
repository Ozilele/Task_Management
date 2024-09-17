{/* <div 
tabIndex={0}
onBlur={() => setDropdownMenu(false)}
onClick={() => setDropdownMenu(!dropdownMenuOpen)} 
className='w-full relative flex justify-between items-center max-w-lg m-auto gap-1 text-lg bg-white h-11 border-2 border-transparent rounded-md focus:border-blue-500'
>
<span className='pl-2'>{stack}</span>
{dropdownMenuOpen && <ExpandMoreIcon onClick={() => setDropdownMenu(!dropdownMenuOpen)} className='absolute right-1 m-auto' />}
{!dropdownMenuOpen && <ExpandLessIcon onClick={() => setDropdownMenu(!dropdownMenuOpen)} className='absolute right-1 m-auto' />}
{dropdownMenuOpen && <DropdownList value={stack} setFunc={setStack} items={specializationItems}/> }
</div> */}

useEffect(() => {
    api.get("/api/projects", )
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