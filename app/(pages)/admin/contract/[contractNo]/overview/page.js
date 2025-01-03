import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const ContractOverviewPage = dynamic(
    () => import('@/templates/admin/contract/ContractOverviewPage'),
    {
        ssr: false,
    }
);

export const metadata = {
    title: 'امیدار | اطلاعات قرارداد',
};

export default function ContractOverview({ params }) {
    return (
        <Suspense
            fallback={<div className="suspense">در حال بارگذاری ...</div>}
        >
            <ContractOverviewPage contractNo={params.contractNo} />
        </Suspense>
    );
}
