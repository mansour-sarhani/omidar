import { ADD_COMMENT_TO_DOCUMENT } from '@/redux/features/contractSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function addCommentToDocument(dispatch, enqueueSnackbar, data) {
    try {
        const result = await dispatch(ADD_COMMENT_TO_DOCUMENT(data));
        const response = unwrapResult(result);

        enqueueSnackbar('پیام جدید برای فایل ارسال شد.', {
            variant: 'success',
        });
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default addCommentToDocument;
