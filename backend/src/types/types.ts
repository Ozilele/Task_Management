export enum UserStack {
  Frontend = "Frontend",
  Backend = "Backend",
  Mobile = "Mobile",
  DevOps = "DevOps"
}

export interface User {
  name: string,
  email: string,
  stack?: UserStack,
  password: string,
}