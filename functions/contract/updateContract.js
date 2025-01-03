import { UPDATE_CONTRACT } from '@/redux/features/contractSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function updateContract(dispatch, enqueueSnackbar, data) {
    try {
        const result = await dispatch(UPDATE_CONTRACT(data));
        const response = unwrapResult(result);

        enqueueSnackbar('اطلاعات قرارداد به روزرسانی شد', {
            variant: 'success',
        });
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default updateContract;
