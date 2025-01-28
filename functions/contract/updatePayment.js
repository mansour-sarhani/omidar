import { UPDATE_PAYMENT } from '@/redux/features/contractSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function updatePayment(dispatch, enqueueSnackbar, data) {
    try {
        const result = await dispatch(UPDATE_PAYMENT(data));
        const response = unwrapResult(result);

        enqueueSnackbar('سند پرداخت به روزرسانی شد', {
            variant: 'success',
        });
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default updatePayment;
