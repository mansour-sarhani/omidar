import { GET_USER_UNREAD_NOTIFICATIONS } from '@/redux/features/userSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function getUserUnreadNotifications(
    dispatch,
    enqueueSnackbar,
    setState,
    setTotal
) {
    try {
        const result = await dispatch(GET_USER_UNREAD_NOTIFICATIONS());
        const response = unwrapResult(result);

        setState(response.data);
        setTotal(response.total);
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default getUserUnreadNotifications;
