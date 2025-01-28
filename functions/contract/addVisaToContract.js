import { ADD_VISA_TO_CONTRACT } from '@/redux/features/contractSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function addVisaToContract(dispatch, enqueueSnackbar, data) {
    try {
        const result = await dispatch(ADD_VISA_TO_CONTRACT(data));
        const response = unwrapResult(result);

        enqueueSnackbar('ویزای جدید به قرارداد اضافه شد.', {
            variant: 'success',
        });
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default addVisaToContract;
