import { ADD_DOCUMENT_TEMPLATE } from '@/redux/features/publicSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function addDocTemplate(dispatch, enqueueSnackbar, data) {
    try {
        const result = await dispatch(ADD_DOCUMENT_TEMPLATE(data));
        const response = unwrapResult(result);

        enqueueSnackbar(' نمونه قالب فایل جدید با موفقیت ایجاد شد.', {
            variant: 'success',
        });
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default addDocTemplate;
