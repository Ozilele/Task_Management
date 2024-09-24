
export enum Specialization {
  FRONTEND = "FRONTEND",
  BACKEND = "BACKEND",
  DEVOPS = "DEVOPS",
  UX_UI = "UX/UI",
  NONE = "",
}

export enum TaskState {
  TO_DO = "To Do",
  IN_PROGRESS = "In Progress",
  UNDER_REVIEW = "Under Review",
  COMPLETED = "Completed"
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
  id: number,
  username: string,
  email: string,
  date_joined?: string,
  has_email_verified?: boolean,
  is_superuser?: boolean
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

export interface Task {
  id: number,
  title: string,
  content: string,
  state: string,
  author: number,
  assigned_to: number[] | User[],
  project: number
}

export type TaskData = {
  title: string,
  content: string,
  state: string,
  currAssignedUsers: User[] | null;
}

export type CurrTaskOption = "All Tasks" | "My Tasks" | "Created";

export type CurrViewOption = {
  name: "Grid" | "List" | "Board",
  icon: React.ElementType,
}

export type TaskFormData = {
  task_id: number, // task_id
  title: string,
  content: string,
  state: string,
  project_id: number // project id
  currAssignedUsers: User[],
}