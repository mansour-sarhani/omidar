import { ADD_USER_TO_CONTRACT } from '@/redux/features/contractSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function addUserToContract(dispatch, enqueueSnackbar, data) {
    try {
        const result = await dispatch(ADD_USER_TO_CONTRACT(data));
        const response = unwrapResult(result);

        enqueueSnackbar('کاربر جدید به قرارداد اضافه شد.', {
            variant: 'success',
        });
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default addUserToContract;
