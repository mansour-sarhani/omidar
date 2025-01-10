import { GET_CLIENT_UNREAD_NOTIFICATIONS } from '@/redux/features/clientSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function getClientUnreadNotifications(
    dispatch,
    enqueueSnackbar,
    setState,
    setTotal
) {
    try {
        const result = await dispatch(GET_CLIENT_UNREAD_NOTIFICATIONS());
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

export default getClientUnreadNotifications;
