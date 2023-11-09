import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppTheme, FormMode, TaskFormData } from "../types/project-types";
import { RootState } from "../app/store";

interface AppState {
  isModalOpen: boolean,
  currTheme: AppTheme
  taskFormData: TaskFormData | null,
  formMode: FormMode,
}

const initialState: AppState = {
  isModalOpen: false,
  currTheme: AppTheme.DARK,
  taskFormData: null,
  formMode: FormMode.ADD,
}

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    toggleModal: (state, action: PayloadAction<boolean>) => {
      state.isModalOpen = action.payload;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
    },
    openModal: (state) => {
      state.isModalOpen = true;
    },
    changeFormMode: (state, action: PayloadAction<FormMode>) => {
      state.formMode = action.payload;
    },
    setTaskFormData: (state, action: PayloadAction<TaskFormData | null>) => {
      state.taskFormData = action.payload;
    },
    resetTaskFormData: (state) => {
      state.taskFormData = null;
    },
    setAppTheme: (state, action: PayloadAction<AppTheme>) => {
      state.currTheme = action.payload;
    }
  }
});

export const { toggleModal, closeModal, openModal, changeFormMode, setTaskFormData, resetTaskFormData, setAppTheme } = appSlice.actions;
export const selectTaskFormData = (state: RootState) => state.app.taskFormData;
export const selectAppTheme = (state: RootState) => state.app.currTheme;
export const selectModalOpen = (state: RootState) => state.app.isModalOpen;
export const selectFormMode = (state: RootState) => state.app.formMode;

export default appSlice.reducer;