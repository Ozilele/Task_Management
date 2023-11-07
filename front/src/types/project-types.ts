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

export type User = {
  id: string,
  name: string,
  specialization: Specialization
}

export type Project = {
  id: number,
  name: string,
  users: User[],
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
