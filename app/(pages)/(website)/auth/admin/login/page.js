import UserLoginPage from '@/templates/admin/UserLoginPage';
import { Suspense } from 'react';

export const metadata = {
    title: 'امیدار | ورود کاربران به پرتال',
};

export default function UserLogin() {
    return (
        <Suspense
            fallback={<div className="suspense">در حال بارگذاری ...</div>}
        >
            <UserLoginPage />
        </Suspense>
    );
}
