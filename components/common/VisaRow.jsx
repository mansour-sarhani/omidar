import { dateTimeFormatter } from '@/utils/dateTimeFormatter';
import setStatusLabel from '@/utils/setStatusLabel';
import { Button } from '@mui/material';
import React from 'react';

export default function VisaRow(props) {
    const { visa } = props;
    return (
        <div className={`visa-row ${visa.status}`}>
            <div className="visa-column">
                <div className="visa-row-title">نوع ویزا: {visa.visaType}</div>
                <div className="visa-row-item">
                    <label>آخرین به روز رسانی:</label>
                    <span>
                        {dateTimeFormatter(
                            visa.updatedAt ? visa.updatedAt : visa.createdAt
                        )}
                    </span>
                </div>
            </div>
            <div className="visa-column">
                <div className="visa-row-item">
                    <label>متقاضی:</label>
                    <span>{visa.clientName}</span>
                </div>
                <div className="visa-row-item">
                    <label>شماره قرارداد:</label>
                    <span>{visa.contractNo}</span>
                </div>
            </div>
            <div className="visa-row-utils">
                <div className="visa-row-item">
                    <span>{setStatusLabel(visa.status)}</span>
                </div>

                <div className="visa-row-item">
                    <Button
                        href={`/admin/contract/${visa.contractNo}/visas`}
                        variant="outlined"
                        color="primary"
                    >
                        مشاهده
                    </Button>
                </div>
            </div>
        </div>
    );
}
