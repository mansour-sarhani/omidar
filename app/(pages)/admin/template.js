'use client';

import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { usePathname, useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { setViewPort } from '@/redux/features/settingsSlice';
import IsLoading from '@/components/common/IsLoading';
import { useMediaQuery } from '@mui/system';
import getCurrentUser from '@/functions/user/getCurrentUser';
import AdminHeader from '@/layouts/admin/header/AdminHeader';
import AdminSidebar from '@/layouts/admin/sidebar/AdminSidebar';

export default function AdminTemplate({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const isDesktop = useMediaQuery('(min-width:992px)');
    const isTablet = useMediaQuery('(min-width:768px) and (max-width:991px)');
    const isMobile = useMediaQuery('(max-width:480px)');

    const currentToken = Cookies.get('om_token');

    useEffect(() => {
        if (currentToken) {
            setIsLoading(true);
            async function fetchUser() {
                try {
                    await getCurrentUser(dispatch, enqueueSnackbar, setUser);
                } catch (error) {
                    setUser(false);
                } finally {
                    setIsLoading(false);
                }
            }
            fetchUser();
        } else {
            setUser(false);
            setIsLoading(false);
        }
    }, [currentToken, dispatch, enqueueSnackbar]);

    useEffect(() => {
        if (isDesktop) {
            dispatch(setViewPort({ viewPort: 'desktop' }));
        } else if (isTablet) {
            dispatch(setViewPort({ viewPort: 'tablet' }));
        } else if (isMobile) {
            dispatch(setViewPort({ viewPort: 'mobile' }));
        }
    }, [isDesktop, isTablet, isMobile, dispatch]);

    useEffect(() => {
        if (user === false && pathname.startsWith('/admin/')) {
            router.push('/auth/admin/login');
        }
    }, [user, pathname, router]);

    return isLoading || user === null ? (
        <IsLoading isLoading={true} />
    ) : (
        <div className="main">
            <div className="panel-page-wrapper">
                <div className="panel-header">
                    <AdminHeader user={user} />
                </div>
                {isDesktop && user && (
                    <div className="panel-sidebar">
                        <AdminSidebar user={user} />
                    </div>
                )}
                <div className="panel-content">{children}</div>
            </div>
        </div>
    );
}
