'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { useSnackbar } from 'notistack';

const useCommonHooks = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const pathname = usePathname();
    const userData = useSelector((state) => state.user.userData);
    const clientData = useSelector((state) => state.client.clientData);

    return {
        dispatch,
        enqueueSnackbar,
        router,
        pathname,
        userData,
        clientData,
    };
};

export default useCommonHooks;
