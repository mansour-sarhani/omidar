import { ADD_DOCUMENT_TO_CONTRACT } from '@/redux/features/contractSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function addDocumentToContract(dispatch, enqueueSnackbar, data) {
    try {
        const result = await dispatch(ADD_DOCUMENT_TO_CONTRACT(data));
        const response = unwrapResult(result);

        enqueueSnackbar('چک لیست فایل جدید با موفقیت ایجاد شد.', {
            variant: 'success',
        });
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default addDocumentToContract;
