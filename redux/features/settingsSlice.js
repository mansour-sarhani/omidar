import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
    status: 'idle',
    theme: 'light',
    lang: 'fa',
    viewPort: 'desktop',
};

export const settingsSlice = createSlice({
    name: 'public',
    initialState,
    reducers: {
        toggleTheme: (state, action) => {
            const theme = action.payload.theme;
            state.theme = theme;
            // Use try-catch for localStorage to handle SSR
            try {
                localStorage.setItem('theme', theme);
            } catch (error) {
                console.warn('localStorage not available:', error);
            }
        },
        toggleLanguage: (state, action) => {
            const lang = action.payload.lang;
            state.lang = lang;
            try {
                localStorage.setItem('lang', lang);
            } catch (error) {
                console.warn('localStorage not available:', error);
            }
        },
        setViewPort: (state, action) => {
            const viewPort = action.payload.viewPort;
            state.viewPort = viewPort;
        },
    },
});

// Memoized selectors for better performance
export const selectTheme = createSelector(
    [(state) => state.settings],
    (settings) => settings.theme
);

export const selectLanguage = createSelector(
    [(state) => state.settings],
    (settings) => settings.lang
);

export const selectViewPort = createSelector(
    [(state) => state.settings],
    (settings) => settings.viewPort
);

export const selectStatus = createSelector(
    [(state) => state.settings],
    (settings) => settings.status
);

export const { toggleTheme, toggleLanguage, setViewPort } =
    settingsSlice.actions;

export default settingsSlice.reducer;
