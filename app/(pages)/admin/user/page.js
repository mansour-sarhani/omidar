import UserManagementPage from '@/templates/admin/UserManagementPage';
import { Suspense } from 'react';

export const metadata = {
    title: 'امیدار | مدیریت افراد مجموعه',
};

export default function UserManagement() {
    return (
        <Suspense
            fallback={<div className="suspense">در حال بارگذاری ...</div>}
        >
            <UserManagementPage />
        </Suspense>
    );
}
