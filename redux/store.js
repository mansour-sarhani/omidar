import { configureStore } from '@reduxjs/toolkit';

import settingsSlice from './features/settingsSlice';
import publicSlice from './features/publicSlice';
import adminSlice from './features/adminSlice';
import userSlice from './features/userSlice';
import clientSlice from './features/clientSlice';
import contractSlice from './features/contractSlice';

export default configureStore({
    reducer: {
        settings: settingsSlice,
        public: publicSlice,
        admin: adminSlice,
        user: userSlice,
        client: clientSlice,
        contract: contractSlice,
    },
});
