import { USER_READ_NOTIFICATION } from '@/redux/features/userSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function userReadNotification(dispatch, enqueueSnackbar, notificationId) {
    try {
        const result = await dispatch(USER_READ_NOTIFICATION(notificationId));
        const response = unwrapResult(result);
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default userReadNotification;
