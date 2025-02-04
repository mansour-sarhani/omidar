import UserProfilePage from '@/templates/admin/UserProfilePage';
import { Suspense } from 'react';

export const metadata = {
    title: 'امیدار | پروفایل کاربری',
};

export default function UserProfile() {
    return (
        <Suspense
            fallback={<div className="suspense">در حال بارگذاری ...</div>}
        >
            <UserProfilePage />
        </Suspense>
    );
}
