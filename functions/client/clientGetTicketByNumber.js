import { CLIENT_GET_TICKET_BY_NUMBER } from '@/redux/features/clientSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function clientGetTicketByNumber(
    dispatch,
    enqueueSnackbar,
    setState,
    ticketNo
) {
    try {
        const result = await dispatch(CLIENT_GET_TICKET_BY_NUMBER(ticketNo));
        const response = unwrapResult(result);

        setState(response.data);
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default clientGetTicketByNumber;
