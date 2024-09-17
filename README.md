# Task and project management Application

Project Management Application for viewing projects, tasks, assigning users to tasks, projects with many functionalities such as drag and drop a task to specific state

## Stack: 
On Frontend:
* React, Typescript
* [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd) for drag and drop functionality
* [Material UI](https://mui.com/material-ui/) for icons and components
* [Axios](https://github.com/axios/axios) for api calls and implementing interceptors
* [react-router-dom](https://www.npmjs.com/package/react-router-dom) for frontend routing

On Backend:
* Python, Django framework, Django Rest Framework
* Embeedded SQLite Local Database for users, tasks, projects
* JWT Authorization with access and refresh tokens implementation
* Securing specific endpoints from unauthorized access 