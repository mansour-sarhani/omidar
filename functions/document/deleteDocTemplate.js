import { DELETE_DOCUMENT_TEMPLATE } from '@/redux/features/publicSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function deleteDocTemplate(dispatch, enqueueSnackbar, countryId) {
    try {
        const result = await dispatch(DELETE_DOCUMENT_TEMPLATE(countryId));
        const response = unwrapResult(result);

        enqueueSnackbar('نمونه قالب با موفقیت حذف شد.', {
            variant: 'success',
        });
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default deleteDocTemplate;
