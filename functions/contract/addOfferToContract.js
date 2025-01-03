import { ADD_OFFER_TO_CONTRACT } from '@/redux/features/contractSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function addOfferToContract(dispatch, enqueueSnackbar, data) {
    try {
        const result = await dispatch(ADD_OFFER_TO_CONTRACT(data));
        const response = unwrapResult(result);

        enqueueSnackbar('آفر جدید با موفقیت ایجاد شد.', {
            variant: 'success',
        });
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default addOfferToContract;
