import { dateTimeFormatter } from '@/utils/dateTimeFormatter';
import setStatusLabel from '@/utils/setStatusLabel';
import { Button } from '@mui/material';
import React from 'react';

export default function DocumentRow(props) {
    const { document } = props;
    return (
        <div className={`document-row ${document.status}`}>
            <div className="document-column">
                <div className="document-row-title">{document.nameFarsi}</div>
                <div className="document-row-item">
                    <label>آخرین به روز رسانی:</label>
                    <span>
                        {dateTimeFormatter(
                            document.updatedAt
                                ? document.updatedAt
                                : document.createdAt
                        )}
                    </span>
                </div>
            </div>
            <div className="document-column">
                <div className="document-row-item">
                    <label>متقاضی:</label>
                    <span>{document.clientName}</span>
                </div>
                <div className="document-row-item">
                    <label>شماره قرارداد:</label>
                    <span>{document.contractNo}</span>
                </div>
            </div>
            <div className="document-row-utils">
                <div className="document-row-item">
                    <span>{setStatusLabel(document.status)}</span>
                </div>

                <div className="document-row-item">
                    <Button
                        href={`/admin/contract/${document.contractNo}/documents`}
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
