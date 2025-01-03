'use client';

import ContractNavigation from '@/components/common/ContractNavigation';
import IsLoading from '@/components/common/IsLoading';
import useContract from '@/hooks/useContract';
import { dateFormatter } from '@/utils/dateFormatter';
import setStatusLabel from '@/utils/setStatusLabel';
import { Download } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';

export default function ContractOverviewPage({ contractNo }) {
    const { contract } = useContract(contractNo);

    const handleDownload = () => {
        const fileUrl = `${contract.contractFile.path}${contract.contractFile.url}`;
        window.open(fileUrl, '_blank');
    };

    if (!contract) {
        return <IsLoading isLoading={true} />;
    }

    return (
        <div className="contract-page">
            <ContractNavigation contractNo={contractNo} />
            <div className="contract-page-content">
                <div className="contract-page-heading">
                    <Typography variant="h4">اطلاعات قرارداد</Typography>
                    {setStatusLabel(contract.status)}
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
                                {contract.updatedAt
                                    ? dateFormatter(contract.updatedAt)
                                    : dateFormatter(contract.createdAt)}
                            </span>
                        </div>
                    </div>
                    <div className="contract-info-row">
                        <div className="contract-info-line">
                            <label className="contract-info-label">
                                متقاضی:
                            </label>
                            <span className="contract-info-value">
                                {contract.client.sex &&
                                contract.client.sex === 'male'
                                    ? 'آقای'
                                    : 'خانم'}{' '}
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
                                تاریخ ورود:
                            </label>
                            <span className="contract-info-value">
                                {contract.arrivalDate
                                    ? contract.arrivalDate
                                    : '-'}
                            </span>
                        </div>
                        <div className="contract-info-line">
                            <label className="contract-info-label">
                                تاریخ انقضای ویزا:
                            </label>
                            <span className="contract-info-value">
                                {contract.visaExpiryDate
                                    ? contract.visaExpiryDate
                                    : '-'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="contract-file-download">
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleDownload}
                    >
                        <Download />
                        دانلود فایل قرارداد
                    </Button>
                </div>
            </div>
        </div>
    );
}
