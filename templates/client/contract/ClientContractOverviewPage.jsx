'use client';

import { useEffect, useState } from 'react';
import useCommonHooks from '@/hooks/useCommonHooks';
import { dateFormatter } from '@/utils/dateFormatter';
import setStatusLabel from '@/utils/setStatusLabel';
import getContractByContractNo from '@/functions/contract/getContractByContractNo';
import ClientContractNavigation from '@/components/common/ClientContractNavigation';
import IsLoading from '@/components/common/IsLoading';
import Typography from '@mui/material/Typography';

export default function ClientContractOverviewPage({ contractNo }) {
    const [contract, setContract] = useState(null);
    const [doReload, setDoReload] = useState(true);

    const { dispatch, enqueueSnackbar } = useCommonHooks();

    useEffect(() => {
        if (doReload) {
            async function fetchContract() {
                await getContractByContractNo(
                    dispatch,
                    enqueueSnackbar,
                    setContract,
                    contractNo
                );
            }
            fetchContract();
            setDoReload(false);
        }
    }, [contractNo, dispatch, doReload, enqueueSnackbar]);

    if (!contract) {
        return <IsLoading isLoading={true} />;
    }

    return (
        <div className="contract-page">
            <ClientContractNavigation contractNo={contractNo} />
            <div className="contract-page-content">
                <div className="contract-page-heading">
                    <Typography variant="h4">اطلاعات قرارداد</Typography>
                </div>
                <div className="contract-info-wrapper">
                    <div className="contract-info-row">
                        <div className="contract-info-line">
                            <label className="contract-info-label">
                                شماره قرارداد:
                            </label>
                            <span className="contract-info-value">
                                {contract.contractNo}
                            </span>
                        </div>
                        <div className="contract-info-line">
                            <label className="contract-info-label">
                                تاریخ صدور قرارداد:
                            </label>
                            <span className="contract-info-value">
                                {contract.issueDate
                                    ? dateFormatter(contract.issueDate)
                                    : '-'}
                            </span>
                        </div>
                        <div className="contract-info-line">
                            <label className="contract-info-label">
                                وضعیت:
                            </label>
                            <span className="contract-info-value">
                                {setStatusLabel(contract.status)}
                            </span>
                        </div>
                    </div>
                    <div className="contract-info-row">
                        <div className="contract-info-line">
                            <label className="contract-info-label">
                                متقاضی:
                            </label>
                            <span className="contract-info-value">
                                {contract.client.gender &&
                                    (contract.client.gender === 'male'
                                        ? 'آقای'
                                        : 'خانم')}{' '}
                                {contract.client.firstName}{' '}
                                {contract.client.lastName}
                            </span>
                        </div>
                        <div className="contract-info-line">
                            <label className="contract-info-label">
                                شماره تماس متقاضی:
                            </label>
                            <span className="contract-info-value">
                                {contract.client.mobile}
                            </span>
                        </div>
                        <div className="contract-info-line">
                            <label className="contract-info-label">
                                ایمیل متقاضی:
                            </label>
                            <span className="contract-info-value">
                                {contract.client.email}
                            </span>
                        </div>
                    </div>
                    <div className="contract-info-row">
                        <div className="contract-info-line">
                            <label className="contract-info-label">کشور:</label>
                            <span className="contract-info-value">
                                {contract.countries[0].nameFarsi}
                            </span>
                        </div>
                        <div className="contract-info-line">
                            <label className="contract-info-label">
                                زمان ایجاد قرارداد:
                            </label>
                            <span className="contract-info-value">
                                {dateFormatter(contract.createdAt)}
                            </span>
                        </div>
                        <div className="contract-info-line">
                            <label className="contract-info-label">
                                آخرین به روزرسانی:
                            </label>
                            <span className="contract-info-value">
                                {dateFormatter(
                                    contract.updatedAt
                                        ? contract.updatedAt
                                        : contract.createdAt
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
