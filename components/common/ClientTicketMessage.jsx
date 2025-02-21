import React from 'react';
import OmAvatar from './OmAvatar';
import { dateTimeFormatter } from '@/utils/dateTimeFormatter';
import Button from '@mui/material/Button';
import Download from '@mui/icons-material/Download';
import DOMPurify from 'dompurify';
import { handleDownload } from '@/utils/createDownloadLink';

export default function ClientTicketMessage(props) {
    const { message } = props;

    const messageClass =
        message.authorModel === 'Client' ? 'sender' : 'receiver';

    return (
        <div className={`ticket-message ${messageClass}`}>
            <div
                className="ticket-message-body"
                dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                        message.body.replace(/\n/g, '<br />')
                    ),
                }}
            ></div>
            <div className="ticket-message-info">
                <div className="ticket-message-author">
                    <OmAvatar person={message.author} width={30} height={30} />
                    <span>
                        {message.author.firstName} {message.author.lastName}
                    </span>
                </div>
                <div className="ticket-message-date">
                    {dateTimeFormatter(message.createdAt)}
                </div>
            </div>
            {message.hasAttachment && (
                <div className="ticket-message-attachment">
                    <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => handleDownload(message.attachment)}
                    >
                        <Download />
                        دانلود ضمیمه
                    </Button>
                </div>
            )}
        </div>
    );
}
