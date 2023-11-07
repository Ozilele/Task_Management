import 'tailwindcss/tailwind.css'
import './App.css'
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Project from './pages/Project'
import Navigation from './components/Navigation'

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
    <>
      <Navigation/>
      <Outlet/>
    </>,
    children: [
      {
        index: true,
        element: <Home/>
      },
      {
        path: "project/:id",
        element: <Project/>
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
