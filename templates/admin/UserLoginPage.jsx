'use client';

import { useEffect } from 'react';
import useCommonHooks from '@/hooks/useCommonHooks';
import UserLoginForm from '@/components/forms/UserLoginForm';

export default function UserLoginPage() {
    const { enqueueSnackbar, router, searchParams } = useCommonHooks();

    const logout = searchParams.get('logout');

    useEffect(() => {
        if (logout === 'success') {
            router.replace('/auth/admin/login');
            enqueueSnackbar('خروج از حساب کاربری', {
                variant: 'info',
            });
        }
    }, [enqueueSnackbar, logout, router, searchParams]);

    return (
        <div className="inner-page auth-page">
            <div className="auth-page-container">
                <div className="auth-page-box">
                    <UserLoginForm />
                </div>
            </div>
        </div>
    );
}
