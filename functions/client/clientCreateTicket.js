import { CLIENT_CREATE_TICKET } from '@/redux/features/clientSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function clientCreateTicket(dispatch, enqueueSnackbar, router, data) {
    try {
        const result = await dispatch(CLIENT_CREATE_TICKET(data));
        const response = unwrapResult(result);

        if (response.success) {
            enqueueSnackbar('تیکت جدید با موفقیت ایجاد شد', {
                variant: 'success',
            });
            router.push('/panel/ticket');
        }
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default clientCreateTicket;
