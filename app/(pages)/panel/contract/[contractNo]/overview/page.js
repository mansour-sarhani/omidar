import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const ClientContractOverviewPage = dynamic(
    () => import('@/templates/client/contract/ClientContractOverviewPage'),
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
            <ClientContractOverviewPage contractNo={params.contractNo} />
        </Suspense>
    );
}
