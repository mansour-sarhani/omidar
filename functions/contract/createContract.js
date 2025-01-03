import { CREATE_CONTRACT } from '@/redux/features/contractSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function createContract(dispatch, enqueueSnackbar, data) {
    try {
        const result = await dispatch(CREATE_CONTRACT(data));
        const response = unwrapResult(result);

        enqueueSnackbar('قرارداد جدید با موفقیت ایجاد شد.', {
            variant: 'success',
        });
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default createContract;
