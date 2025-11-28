'use client';

import { useEffect, useState } from 'react';
import { setViewPort } from '@/redux/features/settingsSlice';
import useCommonHooks from '@/hooks/useCommonHooks';
import getCurrentUser from '@/functions/user/getCurrentUser';
import AdminHeader from '@/layouts/admin/header/AdminHeader';
import AdminSidebar from '@/layouts/admin/sidebar/AdminSidebar';
import IsLoading from '@/components/common/IsLoading';
import { useMediaQuery } from '@mui/system';
import { getAuthCookie, removeAllAuthCookies } from '@/utils/cookieUtils';

export default function AdminTemplate({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { router, pathname, dispatch, enqueueSnackbar } = useCommonHooks();

    const isDesktop = useMediaQuery('(min-width:992px)');
    const isTablet = useMediaQuery('(min-width:768px) and (max-width:991px)');
    const isMobile = useMediaQuery('(max-width:480px)');

    const currentToken = getAuthCookie('om_token');

    useEffect(() => {
        if (currentToken) {
            setIsLoading(true);
            async function fetchUser() {
                try {
                    await getCurrentUser(dispatch, enqueueSnackbar, setUser);
                } catch (error) {
                    // Token is invalid or user fetch failed
                    // Remove invalid token and set user to false
                    removeAllAuthCookies();
                    setUser(false);
                } finally {
                    setIsLoading(false);
                }
            }
            fetchUser();
        } else {
            // No token, user is not authenticated
            setUser(false);
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
        // Only redirect if user is explicitly false (not null/loading) and we're on an admin page
        // Use replace to avoid adding to history and prevent loops
        // Don't redirect if we're already on the login page
        if (
            user === false &&
            pathname.startsWith('/admin/') &&
            !pathname.includes('/auth/')
        ) {
            router.replace('/auth/admin/login');
        }
    }, [user, pathname, router]);

    return isLoading || user === null ? (
        <IsLoading isLoading={true} />
    ) : (
        <div className="main">
            <div className="panel-page-wrapper">
                <AdminHeader user={user} />
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
