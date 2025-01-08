import { GET_USER_NOTIFICATIONS } from '@/redux/features/userSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function getUserNotifications(dispatch, enqueueSnackbar, setState, type) {
    try {
        const result = await dispatch(GET_USER_NOTIFICATIONS(type));
        const response = unwrapResult(result);

        setState(response.data);
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default getUserNotifications;
