import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types/auth.types";
import { AUTH_CONFIG } from "@/constants";

const initialState = {
    isDarkMode: false
};

const darkModeSlice = createSlice({
    name: "darkMode",
    initialState,
    reducers: {
        isDarkModeReducer: (state, action) => {
            state.isDarkMode = action.payload;

        }
    },
});
export const { isDarkModeReducer } = darkModeSlice.actions;
export default darkModeSlice.reducer;
