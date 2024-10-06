import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppTheme, FormMode, TaskFormData, User } from "../types/project-types";
import { RootState } from "../app/store";

interface AppState {
  isModalOpen: boolean,
  currTheme: AppTheme
  taskFormData: TaskFormData | null,
  formMode: FormMode,
  projectUsers: User[] | null,
  loggedUser: User | null,
  dataToBeReload: boolean,
}

const initialState: AppState = {
  isModalOpen: false,
  currTheme: AppTheme.DARK,
  taskFormData: null,
  formMode: FormMode.ADD,
  projectUsers: null,
  loggedUser: null,
  dataToBeReload: false,
}

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    toggleModal: (state, action: PayloadAction<boolean>) => {
      state.isModalOpen = action.payload;
    },
    closeModal: (state) => { // close modal window
      state.isModalOpen = false;
    },
    openModal: (state) => { // open modal window
      state.isModalOpen = true;
    },
    changeFormMode: (state, action: PayloadAction<FormMode>) => { // change modal view
      state.formMode = action.payload;
    },
    setTaskFormData: (state, action: PayloadAction<TaskFormData | null>) => { // set modal data
      state.taskFormData = action.payload;
    },
    resetTaskFormData: (state) => { // reset modal values
      state.taskFormData = null;
    },
    setAppTheme: (state, action: PayloadAction<AppTheme>) => {
      state.currTheme = action.payload;
    },
    reloadData: (state) => { // just to reload data
      state.dataToBeReload = !state.dataToBeReload;
    },
    resetReloadData: (state) => {
      state.dataToBeReload = false;
    },
    setProjectUsers: (state, action: PayloadAction<User[] | null>) => { // set Project Users
      state.projectUsers = action.payload;
    },
    setLoggedUser: (state, action: PayloadAction<User | null>) => {
      state.loggedUser = action.payload;
    }
  }
});

export const { toggleModal, closeModal, openModal, changeFormMode, setTaskFormData, resetTaskFormData, setAppTheme, reloadData, resetReloadData, setProjectUsers, setLoggedUser } = appSlice.actions;
export const selectTaskFormData = (state: RootState) => state.app.taskFormData;
export const selectAppTheme = (state: RootState) => state.app.currTheme;
export const selectModalOpen = (state: RootState) => state.app.isModalOpen;
export const selectFormMode = (state: RootState) => state.app.formMode;
export const selectDataToBeReload = (state: RootState) => state.app.dataToBeReload;
export const selectProjectUsers = (state: RootState) => state.app.projectUsers;
export const selectLoggedUser = (state: RootState) => state.app.loggedUser;

export default appSlice.reducer;