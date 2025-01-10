import HomePage from '@/templates/HomePage';
import { Suspense } from 'react';

export const metadata = {
    title: 'امیدار | پنل مدیریت قرارداد',
};

export default function Home() {
    return (
        <Suspense
            fallback={<div className="suspense">در حال بارگذاری ...</div>}
        >
            <HomePage />
        </Suspense>
    );
}
