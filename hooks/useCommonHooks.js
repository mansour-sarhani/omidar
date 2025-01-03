import { useDispatch } from 'react-redux';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useSnackbar } from 'notistack';

const useCommonHooks = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    return { dispatch, enqueueSnackbar, router, pathname, searchParams };
};

export default useCommonHooks;
