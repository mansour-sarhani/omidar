import { REMOVE_VISA_FROM_CONTRACT } from '@/redux/features/contractSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function removeVisaFromContract(dispatch, enqueueSnackbar, data) {
    try {
        const result = await dispatch(REMOVE_VISA_FROM_CONTRACT(data));
        const response = unwrapResult(result);

        enqueueSnackbar('ویزا از قرارداد حذف شد.', {
            variant: 'success',
        });
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default removeVisaFromContract;
