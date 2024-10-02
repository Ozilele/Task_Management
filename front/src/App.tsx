import 'tailwindcss/tailwind.css'
import './App.css'
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Project from './pages/Project'
import Navigation from './components/Navigation'
import ProtectedRoute from './components/ProtectedRoute'
import Task from './pages/Task'

const router = createBrowserRouter([
  {
    path: "auth",
    children: [
      {
        path: "login",
        element: <Login/>,
      },
      {
        path: "register",
        element: <Register/>,
      }
    ]
  },
  {
    path: "/",
    element: 
      <ProtectedRoute>
        <Navigation/>
        <Outlet/>
      </ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Home/>
      },
      {
        path: "project/:id",
        element: <Project/>
      },
      {
        path: "project/:id/task/:taskId",
        element: <Task/>
      }
    ]
  }
]);

function App() {

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
