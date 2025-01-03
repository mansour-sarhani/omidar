import { REMOVE_OFFER_FROM_CONTRACT } from '@/redux/features/contractSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function removeOfferFromContract(dispatch, enqueueSnackbar, data) {
    try {
        const result = await dispatch(REMOVE_OFFER_FROM_CONTRACT(data));
        const response = unwrapResult(result);

        enqueueSnackbar('آفر با موفقیت حذف شد.', {
            variant: 'success',
        });
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default removeOfferFromContract;
