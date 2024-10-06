import { Columns, Specialization, TaskState } from "../types/project-types";
import { v4 as uuidv4 } from 'uuid';
import { CurrViewOption } from "../types/project-types";
import ListRoundedIcon from '@mui/icons-material/ListRounded';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import { REFRESH_TOKEN } from "../constants";
import api, { authResponseInterceptor, setupAuthInterceptor } from "../api";
import { ToastOptions } from "react-toastify";

export const task_states = [
  TaskState.TO_DO,
  TaskState.IN_PROGRESS,
  TaskState.UNDER_REVIEW,
  TaskState.COMPLETED
]

export const specializations = [
  Specialization.FRONTEND,
  Specialization.BACKEND,
  Specialization.DEVOPS,
  Specialization.UX_UI
]

export const my_columns: Columns = {
  [uuidv4()]: {
    title: "To Do",
    tasks: []
  },
  [uuidv4()]: {
    title: "In Progress",
    tasks: [],
  },
  [uuidv4()]: {
    title: "Under Review",
    tasks: [],
  },
  [uuidv4()]: {
    title: "Completed",
    tasks: [],
  }
}

export const tasksOption = [
  {
    name: "All Tasks",
    route: "tasks/"
  },
  {
    name: "My Tasks",
    route: "assigned-tasks/",
  },
  {
    name: "Created",
    route: "created-tasks/"
  }
]

export const viewOption: CurrViewOption[] = [
  {
    name: "Grid",
    icon: GridViewOutlinedIcon,
  },
  {
    name: "List",
    icon: ListRoundedIcon,
  },
  {
    name: "Board",
    icon: DashboardRoundedIcon,
  }
]

export const formatDate = (dateString: string) => {
  const dateObj = new Date(dateString);
  const year = dateObj.getUTCFullYear();
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getUTCDate()).padStart(2, '0');
  const hours = String(dateObj.getUTCHours()).padStart(2, '0');
  const minutes = String(dateObj.getUTCMinutes()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}-${hours}:${minutes}`;
  return formattedDate
}

export const formatMessageDate = (dateString: string) => {
  const date = new Date(dateString);
  const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  return formattedDate;
}

export function stringToColor(string: string) {
  let hash = 0;
  let i;
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';  
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

export const toast_config: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  theme: "dark",
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
}

export const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const common_input_style = "w-full px-1.5 sm:px-2 py-1.5 sm:py-2 lg:py-2.5 lg:px-2.5 rounded-md text-lg"
// invalid:border-red-500 invalid:text-red-600 focus:invalid:border-red-500 focus:invalid:ring-red-500
export const auth_inputs = [
  {
    inputs: [
      {
        name: "username",
        placeholder: "Username",
        type: "text",
        style: `${common_input_style}`
      },
      {
        name: "email",
        error_name: "emailError",
        error: {
          msg: "Please provide a valid email address.",
          style: `text-sm invisible peer-invalid:visible lg:text-base px-1 text-red-500`
        },
        placeholder: "Email",
        type: "email",
        style: `peer ${common_input_style}`
      },
      {
        name: "password",
        error_name: "passwordError",
        error: {
          msg: "",
          style: "text-sm lg:text-base px-1 text-red-500"
        },
        placeholder: "Password",
        type: "password",
        style: ` ${common_input_style}`
      },
      {
        name: "repeat_password",
        error_name: "repeatedPasswordError",
        error: {
          msg: "",
          style: "text-sm lg:text-base px-1 text-red-500"
        },
        placeholder: "Repeat Password",
        type: "password",
        style: `${common_input_style} `
      }
    ],
    route: "register"
  },
  {
    inputs: [
      {
        name: "email",
        error_name: "emailError",
        error: {
          msg: "Please provide a valid email address.",
          style: "text-sm invisible peer-invalid:visible lg:text-base px-1 text-red-500"
        },
        placeholder: "Email",
        type: "email",
        style: `peer ${common_input_style}`
      },
      {
        name: "password",
        error_name: "passwordError",
        error: {
          msg: "",
          style: "text-sm lg:text-base px-1 text-red-500"
        },
        placeholder: "Password",
        type: "password",
        style: ` ${common_input_style}`
      },
      {
        name: "repeat_password",
        error_name: "repeatedPasswordError",
        error: {
          msg: "",
          style: "text-sm lg:text-base px-1 text-red-500"
        },
        placeholder: "Repeat Password",
        type: "password",
        style: `${common_input_style} `
      }
    ],
    route: "login"
  }
]

export const specializationItems = [
  "Frontend", "Backend", "UX/UI", "DevOps"
];

export const validateEmailAddress = (email: string) => {
  const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if(email.match(emailFormat)) {
    return true;
  }
  return false;
}

export const validatePassword = (password: string) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*[\d$@.!%*#?&])[A-Za-z\d$@.!%*#?&]{6,15}$/;
  // Password Regex (?=.*[A-Za-z]) - at least 1 ASCII letter
  // (?=.*[\d$@.!%*#?&]) - at least 1 digit or any of the special chars in the class
  // [A-Za-z\d$@.!%*#?&]{8,15} string only consist of letters, digits and special chars from 6 to 15 occurences
  if(password.match(passwordRegex)) {
    return true;
  }
  return false;
}

export const refreshToken = async (ejectInterceptor: boolean) => { 
  const refresh_token = localStorage.getItem(REFRESH_TOKEN);
  if(ejectInterceptor && authResponseInterceptor != null) { // eject the interceptor
    api.interceptors.response.eject(authResponseInterceptor);
  }
  return api.post("/api/auth/token/refresh/", { refresh: refresh_token })
    .then((response) => {
      if(response.status === 200) {
        return response.data.access;
      }
      return Promise.reject(response.status + " " + response.statusText);
    })
    .catch((err) => {
      console.log("Error refreshing");
      return Promise.reject(err);
    })
    .finally(() => {
      if(ejectInterceptor) { // setting up again authResponseInterceptor
        setupAuthInterceptor();
      }
    });
}

export const dummy_chat_messages = [
  {
    "message": "Siema widzowie, co tam u was",
    "author": "Mario",
    "timestamp": "2024-09-27 16:51:21"
  },
  {
    "message": "Elo 🫠",
    "author": "Maryska_",
    "timestamp": "2024-09-27 16:52:25"
  },
  {
    "message": "Siemanko 😎😎",
    "author": "Jeff_12",
    "timestamp": "2024-09-27 16:53:11"
  },
  {
    "message": "Joł",
    "author": "Chris",
    "timestamp": "2024-09-27 16:55:35"
  },
  {
    "message": "Cześć, wszyscy są juz dostępni online?",
    "author": "Jeff_12",
    "timestamp": "2024-09-27 16:57:04"
  },
  {
    "message": "Chyba tak",
    "author": "Mario",
    "timestamp": "2024-09-27 16:57:21"
  },
]