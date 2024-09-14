export enum Specialization {
  FRONTEND = "FRONTEND",
  BACKEND = "BACKEND",
  DEVOPS = "DEVOPS",
  UX_UI = "UX/UI",
  NONE = "",
}

export enum Estimation {
  ONE = "ONE",
  TWO = "TWO",
  THREE = "THREE",
  FIVE = "FIVE",
  EIGHT = "EIGHT",
  THIRTEEN = "THIRTEEN",
  TWENTY_ONE = "TWENTY_ONE"
}

export enum TaskState {
  NOT_ASSIGNED = "NOT_ASSIGNED",
  IN_PROGRESS = "IN_PROGRESS",
  CLOSED = "CLOSED",
  DELETED = "DELETED"
}

export enum FormMode {
  ADD = "ADD",
  EDIT = "EDIT"
}

export enum AppTheme {
  DARK = "dark",
  LIGHT = "light"
}

export type AuthInputElement = {
  name: string,
  error_name?: string,
  error?: {
    msg: string,
    style: string,
  } 
  placeholder: string,
  type: string,
  style: string,
}

export type AuthFormInputsState = {
  username?: string,
  email: string,
  password: string,
  repeat_password: string,
}

export type AuthFormErrors = {
  passwordError: string,
  repeatedPasswordError: string,
}

export type User = {
  id: string,
  name: string,
  specialization: Specialization
}

export type Project = {
  id: number,
  title: string,
  description: string,
  team: number[],
  author: number,
  created_at: string,
  last_modified: string,
}

export interface TaskCredentials {
  name: string;
  assignedTo?: {
    userId: string
  };
  estimation: string;
  specialization: Specialization;
}

export interface Task {
  _id: string,
  projectId: string,
  credentials: TaskCredentials,
  state: string,
  createdAt: number,
  createdBy: {
    userId: string
  },
}

export interface MyTask {
  id: string,
  createdBy: {
    userId: string
  },
  dateCreated: string,
  state: string,
  projectId: string,
  data: {
    name: string,
    estimation: string,
    specialization: string,
    assignedTo: {
      userId: string,
    }
  }
}

export type TaskItem = {
  name: string,
  estimation: string,
  specialization: string,
  assignedTo: {
    userId: string,
  },
  dateCreated: string,
  createdBy: {
    userId: string
  }
}

export type TaskData = {
  name: string,
  estimation: string,
  specialization: string,
  assignedTo: {
    id: string,
    name: string,
    specialization: Specialization
  }
}

export type TaskFormData = {
  name: string,
  taskId?: string,
  estimation: string,
  specialization: string,
  assignedTo: {
    userId: string,
  },
  dateCreated: string,
  createdBy: {
    userId: string
  }
}