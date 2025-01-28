import { CLIENT_UPLOAD_VISA_FILE } from '@/redux/features/clientSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function clientUploadVisaFile(dispatch, enqueueSnackbar, data) {
    try {
        const result = await dispatch(CLIENT_UPLOAD_VISA_FILE(data));
        const response = unwrapResult(result);

        enqueueSnackbar('فایل با موفقیت بارگذاری شد', {
            variant: 'success',
        });
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default clientUploadVisaFile;
