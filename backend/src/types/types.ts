export enum UserStack {
  FRONTEND = "Frontend",
  BACKEND = "Backend",
  MOBILE = "Mobile",
  DEVOPS = "DevOps"
}

export interface User {
  name: string,
  email: string,
  stack?: UserStack,
  password: string,
}

export type UserToken = {
  userId: string,
  email: string
}