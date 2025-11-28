'use client';

import { useEffect, useMemo, useRef } from 'react';
import useCommonHooks from '@/hooks/useCommonHooks';
import UserLoginForm from '@/components/forms/UserLoginForm';
import { jwtDecode } from 'jwt-decode';
import IsLoading from '@/components/common/IsLoading';
import { Typography } from '@mui/material';
import { useSearchParams, usePathname } from 'next/navigation';
import { getAuthCookie, removeAuthCookie } from '@/utils/cookieUtils';

export default function UserLoginPage() {
    const { enqueueSnackbar, router } = useCommonHooks();
    const pathname = usePathname();
    const hasRedirected = useRef(false);

    const searchParams = useSearchParams();
    const logout = searchParams.get('logout');

    const currentToken = getAuthCookie('om_token');

    // Handle logout message
    useEffect(() => {
        if (logout === 'success') {
            hasRedirected.current = false; // Reset on logout
            router.replace('/auth/admin/login');
            enqueueSnackbar('خروج از حساب کاربری', {
                variant: 'info',
            });
        }
    }, [enqueueSnackbar, logout, router, searchParams]);

    // Validate token and redirect if authenticated
    const tokenValidation = useMemo(() => {
        if (!currentToken) {
            hasRedirected.current = false;
            return { isValid: false, shouldRedirect: false };
        }

        try {
            const decoded = jwtDecode(currentToken);

            // Check if token type matches user
            if (decoded.type === 'user') {
                return { isValid: true, shouldRedirect: true, type: 'user' };
            }

            return { isValid: false, shouldRedirect: false };
        } catch (error) {
            // Token is malformed, remove it
            removeAuthCookie('om_token');
            hasRedirected.current = false;
            return { isValid: false, shouldRedirect: false };
        }
    }, [currentToken]);

    // Redirect if user is already authenticated (only once, prevent loops)
    useEffect(() => {
        if (
            tokenValidation.shouldRedirect &&
            !hasRedirected.current &&
            pathname === '/auth/admin/login'
        ) {
            hasRedirected.current = true;
            router.replace('/admin/dashboard');
        }
    }, [tokenValidation.shouldRedirect, router, pathname]);

    return (
        <div className="inner-page auth-page admin-auth">
            <div className="full-bg-container">
                <div className="auth-box-wrapper">
                    <div className="auth-intro">
                        <Typography variant="h1" component="h1" gutterBottom>
                            گروه مهاجرتی امیدار
                        </Typography>
                        <Typography variant="h4" component="h4" gutterBottom>
                            ورود اعضا
                        </Typography>
                    </div>
                    <div className="auth-page-box">
                        <UserLoginForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
