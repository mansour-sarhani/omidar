import { UPDATE_DOCUMENT } from '@/redux/features/contractSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function updateDocument(dispatch, enqueueSnackbar, data) {
    try {
        const result = await dispatch(UPDATE_DOCUMENT(data));
        const response = unwrapResult(result);

        enqueueSnackbar('قالب فایل به روزرسانی شد', {
            variant: 'success',
        });
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default updateDocument;
