import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    isModalOpen: false,
    currTheme: "dark",
    taskFormData: null,
    formMode: "ADD"
  },
  reducers: {
    toggleModal: (state, action) => {
      state.isModalOpen = action.payload;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
    },
    openModal: (state) => {
      state.isModalOpen = true;
    },
    changeFormMode: (state, action) => {
      state.formMode = action.payload;
    },
    setTaskFormData: (state, action) => {
      state.taskFormData = action.payload;
    },
    resetTaskFormData: (state) => {
      state.taskFormData = null;
    },
    setAppTheme: (state, action) => {
      state.currTheme = action.payload;
    }
  }
});

export const { toggleModal, closeModal, openModal, changeFormMode, setTaskFormData, resetTaskFormData, setAppTheme } = appSlice.actions;
export const selectTaskFormData = (state) => state.app.taskFormData;
export const selectAppTheme = (state) => state.app.currTheme;
export const selectModalOpen = (state) => state.app.isModalOpen;
export const selectFormMode = (state) => state.app.formMode;

export default appSlice.reducer;