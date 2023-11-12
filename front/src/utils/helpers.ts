import { Estimation, Specialization } from "../types/project-types";
import { v4 as uuidv4 } from 'uuid';

export const backend_url = "http://localhost:4444";

export const API_URL = "https://task-manager-api-401408.lm.r.appspot.com"
export const standard_headers = {
  headers: {
    'Content-Type': 'application/json',
    'user-id': "u_rdokvuomzxlexevwbcfr",
    'secret-key': "zzkukrviybwqreleibsduakorgqqgmeiwdgackmuitinkysygvpedhryywjfqltlksuuiklhqznmnayxvxnhnpmvsfanahzgajsncpoblkqbhdyldntawlnzbvmhqczp"
  }
}

export const fibNumbers = [
  Estimation.ONE,
  Estimation.TWO,
  Estimation.THREE,
  Estimation.FIVE,
  Estimation.EIGHT,
  Estimation.THIRTEEN,
  Estimation.TWENTY_ONE
];

export const specializations = [
  Specialization.FRONTEND,
  Specialization.BACKEND,
  Specialization.DEVOPS,
  Specialization.UX_UI
]

export const my_columns = {
  [uuidv4()]: {
    title: "NOT_ASSIGNED",
    tasks: []
  },
  [uuidv4()]: {
    title: "IN_PROGRESS",
    tasks: [],
  },
  [uuidv4()]: {
    title: "CLOSED",
    tasks: [],
  }
}

export const inputsArr = [
  {
    name: "name",
    placeholder: "Name",
    type: 'text'
  },
  {
    name: "email",
    placeholder: "Email",
    type: "email"
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