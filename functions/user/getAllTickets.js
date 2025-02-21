import { USER_GET_ALL_TICKETS } from '@/redux/features/userSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function getAllTickets(
    dispatch,
    enqueueSnackbar,
    setState,
    setTotal,
    data
) {
    try {
        const result = await dispatch(USER_GET_ALL_TICKETS(data));
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

export default getAllTickets;
