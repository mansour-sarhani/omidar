import { USER_REPLY_TO_TICKET } from '@/redux/features/userSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function userReplyToTicket(dispatch, enqueueSnackbar, data) {
    try {
        const result = await dispatch(USER_REPLY_TO_TICKET(data));
        const response = unwrapResult(result);

        enqueueSnackbar('تیکت با موفقیت به روز رسانی شد', {
            variant: 'success',
        });
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default userReplyToTicket;
