'use client';

import { jwtDecode } from 'jwt-decode';
import { useEffect, useMemo } from 'react';
import ClientLoginForm from '@/components/forms/ClientLoginForm';
import useCommonHooks from '@/hooks/useCommonHooks';
import IsLoading from '@/components/common/IsLoading';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { getAuthCookie, removeAuthCookie } from '@/utils/cookieUtils';

export default function ClientLoginPage() {
    const { enqueueSnackbar, router } = useCommonHooks();

    const searchParams = useSearchParams();
    const logout = searchParams.get('logout');

    const currentToken = getAuthCookie('om_token');

    // Handle logout message
    useEffect(() => {
        if (logout === 'success') {
            router.replace('/auth/client/login');
            enqueueSnackbar('خروج از حساب کاربری', {
                variant: 'info',
            });
        }
    }, [enqueueSnackbar, logout, router, searchParams]);

    // Validate token and redirect if authenticated
    // NOTE: We don't check expiration here - let the API handle that
    // The login page should only check if a token exists and redirect if it does
    const tokenValidation = useMemo(() => {
        if (!currentToken) {
            return { isValid: false, shouldRedirect: false };
        }

        try {
            const decoded = jwtDecode(currentToken);

            // Only check token type, not expiration
            // Expiration will be handled by the API
            if (decoded.type === 'client') {
                return { isValid: true, shouldRedirect: true, type: 'client' };
            }

            return { isValid: false, shouldRedirect: false };
        } catch (error) {
            // Token is malformed, remove it
            removeAuthCookie('om_token');
            return { isValid: false, shouldRedirect: false };
        }
    }, [currentToken]);

    // Redirect if user is already authenticated
    useEffect(() => {
        if (tokenValidation.shouldRedirect) {
            router.replace('/panel/dashboard');
        }
    }, [tokenValidation.shouldRedirect, router]);

    return (
        <div className="inner-page auth-page client-auth">
            <div className="om-container">
                <div className="auth-box-wrapper">
                    <div className="auth-box-content">
                        <div className="auth-intro">
                            <Typography
                                variant="h1"
                                component="h1"
                                gutterBottom
                            >
                                گروه مهاجرتی امیدار
                            </Typography>
                            <Typography
                                variant="h4"
                                component="h4"
                                gutterBottom
                            >
                                ورود متقاضیان
                            </Typography>
                        </div>
                        <div className="auth-page-box">
                            <ClientLoginForm />
                        </div>
                    </div>
                    <div className="auth-box-image">
                        <Image
                            src={'/assets/images/website/login.svg'}
                            width={700}
                            height={700}
                            alt="login"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
