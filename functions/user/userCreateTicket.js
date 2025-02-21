import { USER_CREATE_TICKET } from '@/redux/features/userSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function userCreateTicket(dispatch, enqueueSnackbar, router, data) {
    try {
        const result = await dispatch(USER_CREATE_TICKET(data));
        const response = unwrapResult(result);

        if (response.success) {
            enqueueSnackbar('تیکت جدید با موفقیت ایجاد شد', {
                variant: 'success',
            });
            router.push('/admin/ticket');
        }
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default userCreateTicket;
