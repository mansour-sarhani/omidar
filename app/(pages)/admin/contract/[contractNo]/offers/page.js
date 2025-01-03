import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const ContractOffersPage = dynamic(
    () => import('@/templates/admin/contract/ContractOffersPage'),
    {
        ssr: false,
    }
);

export const metadata = {
    title: 'امیدار | پیشنهادها و آفرها',
};

export default function ContractOffers({ params }) {
    return (
        <Suspense
            fallback={<div className="suspense">در حال بارگذاری ...</div>}
        >
            <ContractOffersPage contractNo={params.contractNo} />
        </Suspense>
    );
}
