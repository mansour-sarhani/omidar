import { REMOVE_PAYMENT_FROM_CONTRACT } from '@/redux/features/contractSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function removePaymentFromContract(dispatch, enqueueSnackbar, data) {
    try {
        const result = await dispatch(REMOVE_PAYMENT_FROM_CONTRACT(data));
        const response = unwrapResult(result);

        enqueueSnackbar('سند پرداخت با موفقیت حذف شد.', {
            variant: 'success',
        });
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default removePaymentFromContract;
