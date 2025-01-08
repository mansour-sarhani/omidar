import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const ClientContractOffersPage = dynamic(
    () => import('@/templates/client/contract/ClientContractOffersPage'),
    {
        ssr: false,
    }
);

export const metadata = {
    title: 'امیدار | پیشنهادها و آفرها',
};

export default function ClientContractOffers({ params }) {
    return (
        <Suspense
            fallback={<div className="suspense">در حال بارگذاری ...</div>}
        >
            <ClientContractOffersPage contractNo={params.contractNo} />
        </Suspense>
    );
}
