import { CLIENT_READ_NOTIFICATION } from '@/redux/features/clientSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function clientReadNotification(
    dispatch,
    enqueueSnackbar,
    notificationId
) {
    try {
        const result = await dispatch(CLIENT_READ_NOTIFICATION(notificationId));
        const response = unwrapResult(result);
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default clientReadNotification;
