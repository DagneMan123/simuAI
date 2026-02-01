import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  theme: 'light' | 'dark' | 'system';
  isSidebarOpen: boolean;
  modalOpen: string | null; // ለምሳሌ 'login', 'register' ወይም null
  isLoading: boolean;
}

const initialState: UiState = {
  theme: 'system',
  isSidebarOpen: true,
  modalOpen: null,
  isLoading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.modalOpen = action.payload;
    },
    closeModal: (state) => {
      state.modalOpen = null;
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { 
  setTheme, 
  toggleSidebar, 
  openModal, 
  closeModal, 
  setGlobalLoading 
} = uiSlice.actions;

export default uiSlice.reducer;