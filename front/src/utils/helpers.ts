import { Specialization, TaskState } from "../types/project-types";
import { v4 as uuidv4 } from 'uuid';
import { CurrViewOption } from "../types/project-types";
import ListRoundedIcon from '@mui/icons-material/ListRounded';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';

export const backend_url = "http://localhost:4444";

export const API_URL = "https://task-manager-api-401408.lm.r.appspot.com"
export const standard_headers = {
  headers: {
    'Content-Type': 'application/json',
    'user-id': "u_rdokvuomzxlexevwbcfr",
    'secret-key': "zzkukrviybwqreleibsduakorgqqgmeiwdgackmuitinkysygvpedhryywjfqltlksuuiklhqznmnayxvxnhnpmvsfanahzgajsncpoblkqbhdyldntawlnzbvmhqczp"
  }
}

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

export const my_columns = {
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
    route: "/projects/tasks/"
  },
  {
    name: "My Tasks",
    route: "/projects/assigned-tasks/",
  },
  {
    name: "Created",
    route: "/projects/created-tasks/"
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