import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const ContractDocumentsPage = dynamic(
    () => import('@/templates/admin/contract/ContractDocumentsPage'),
    {
        ssr: false,
    }
);

export const metadata = {
    title: 'امیدار | مدارک و فایلهای قرارداد',
};

export default function ContractDocuments({ params }) {
    return (
        <Suspense
            fallback={<div className="suspense">در حال بارگذاری ...</div>}
        >
            <ContractDocumentsPage contractNo={params.contractNo} />
        </Suspense>
    );
}
