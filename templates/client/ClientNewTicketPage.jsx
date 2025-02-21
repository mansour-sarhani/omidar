'use client';

import ClientNewTicketForm from '@/components/forms/ClientNewTicketForm';
import Typography from '@mui/material/Typography';

export default function ClientNewTicketPage() {
    return (
        <div className="panel-content-container">
            <div className="panel-inner-header">
                <div className="panel-inner-header-text">
                    <Typography variant="h5">تیکت جدید</Typography>
                    <Typography variant="body2">
                        در این قسمت میتوانید تیکت جدید ارسال کنید.
                    </Typography>
                </div>
            </div>
            <div className="panel-inner-content">
                <div className="new-ticket-wrapper">
                    <div className="new-ticket-form">
                        <ClientNewTicketForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
