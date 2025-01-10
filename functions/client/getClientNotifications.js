import { GET_CLIENT_NOTIFICATIONS } from '@/redux/features/clientSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function getClientNotifications(
    dispatch,
    enqueueSnackbar,
    setState,
    setTotal,
    data
) {
    try {
        if (data) {
            const result = await dispatch(GET_CLIENT_NOTIFICATIONS(data));
            const response = unwrapResult(result);

            setState(response.data);
            setTotal(response.total);
        }
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default getClientNotifications;
