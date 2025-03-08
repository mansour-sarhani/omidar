import { CHECK_USER_ENTITY } from '@/redux/features/publicSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function checkUserEntity(dispatch, enqueueSnackbar, setState) {
    try {
        const result = await dispatch(CHECK_USER_ENTITY());
        const response = unwrapResult(result);

        setState(response.type);
    } catch (err) {
        setState(false);
    }
}

export default checkUserEntity;
