import { UPDATE_DOCUMENT_TEMPLATE } from '@/redux/features/publicSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function updateDocTemplate(dispatch, enqueueSnackbar, data) {
    try {
        const result = await dispatch(UPDATE_DOCUMENT_TEMPLATE(data));
        const response = unwrapResult(result);

        enqueueSnackbar('نمونه قالب فایل با موفقیت به روزرسانی شد', {
            variant: 'success',
        });
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default updateDocTemplate;
