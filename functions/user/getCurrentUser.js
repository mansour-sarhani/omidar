import { GET_CURRENT_USER } from '@/redux/features/userSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function getCurrentUser(dispatch, enqueueSnackbar, setState) {
    try {
        const result = await dispatch(GET_CURRENT_USER());
        const response = unwrapResult(result);

        setState(response.data);
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
        setState(false);
    }
}

export default getCurrentUser;
