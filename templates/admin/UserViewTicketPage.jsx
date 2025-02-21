'use client';

import IsLoading from '@/components/common/IsLoading';
import UserTicketMessage from '@/components/common/UserTicketMessage';
import getTicketByNumber from '@/functions/user/getTicketByNumber';
import useCommonHooks from '@/hooks/useCommonHooks';
import { dateTimeFormatter } from '@/utils/dateTimeFormatter';
import { Button, Chip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import TicketReplyForm from '@/components/forms/TicketReplyForm';
import userReplyToTicket from '@/functions/user/userReplyToTicket';
import setStatusLabel from '@/utils/setStatusLabel';
import FA from '@/utils/localizationFa';

export default function UserViewTicketPage({ ticketNo }) {
    const [ticket, setTicket] = useState(null);
    const [doReload, setDoReload] = useState(true);

    const { dispatch, enqueueSnackbar } = useCommonHooks();

    const closeTicket = async () => {
        const data = {
            status: 'closed',
            ticketId: ticket?._id,
        };
        await userReplyToTicket(dispatch, enqueueSnackbar, data);
        setDoReload(true);
    };

    const openTicket = async () => {
        const data = {
            status: 'waitingOnClient',
            ticketId: ticket?._id,
        };
        await userReplyToTicket(dispatch, enqueueSnackbar, data);
        setDoReload(true);
    };

    useEffect(() => {
        if (doReload) {
            async function fetchTickets() {
                await getTicketByNumber(
                    dispatch,
                    enqueueSnackbar,
                    setTicket,
                    ticketNo
                );
                setDoReload(false);
            }
            fetchTickets();
        }
    }, [dispatch, doReload, enqueueSnackbar, ticketNo]);

    if (!ticket) return <IsLoading isLoading={true} />;

    return (
        <div className="panel-content-container">
            <div className="panel-inner-header">
                <div className="panel-inner-header-text">
                    <Typography variant="h5">تیکت {ticketNo}#</Typography>
                    <Typography variant="body2">
                        در این قسمت میتوانید جزییات تیکت را مشاهده کنید و پاسخ
                        ارسال نمایید.
                    </Typography>
                </div>
                {ticket?.status !== 'closed' ? (
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={closeTicket}
                    >
                        <CloseFullscreenIcon />
                        بستن تیکت
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        color="info"
                        size="small"
                        onClick={openTicket}
                    >
                        <OpenInFullIcon />
                        باز کردن تیکت
                    </Button>
                )}
            </div>
            <div className="panel-inner-content">
                <div className="ticket-view-wrapper">
                    <div className="ticket-view-meta">
                        <div className="ticket-view-title">
                            <Typography variant="h5">
                                {ticket?.title}
                            </Typography>
                            {ticket?.contractId && (
                                <Typography variant="body1">
                                    شماره قرارداد:{' '}
                                    {ticket?.contractId.contractNo}
                                </Typography>
                            )}
                            <div className="ticket-view-dates">
                                <Typography variant="body2">
                                    ایجاد شده در:{' '}
                                    {dateTimeFormatter(ticket?.createdAt)}
                                </Typography>
                                <span>|</span>
                                <Typography variant="body2">
                                    آخرین بروز رسانی:{' '}
                                    {ticket?.updatedAt
                                        ? dateTimeFormatter(ticket?.updatedAt)
                                        : '-'}
                                </Typography>
                            </div>
                        </div>
                        <div className="ticket-view-status">
                            {ticket.priority === 'high' ? (
                                <Chip
                                    label={`اولویت ${FA.priority.high}`}
                                    variant="outlined"
                                    color="error"
                                />
                            ) : ticket.priority === 'medium' ? (
                                <Chip
                                    label={`اولویت ${FA.priority.medium}`}
                                    variant="outlined"
                                    color="info"
                                />
                            ) : (
                                <Chip
                                    label={`اولویت ${FA.priority.low}`}
                                    variant="outlined"
                                    color="default"
                                />
                            )}
                            {setStatusLabel(ticket.status)}
                        </div>
                    </div>
                    <div className="ticket-messages-container">
                        {ticket?.messages.map((message) => (
                            <UserTicketMessage
                                key={message._id}
                                message={message}
                            />
                        ))}
                    </div>
                </div>
                {ticket.status !== 'closed' ? (
                    <div className="ticket-reply-wrapper">
                        <TicketReplyForm
                            type="user"
                            ticketId={ticket?._id}
                            setDoReload={setDoReload}
                        />
                    </div>
                ) : (
                    <div className="ticket-closed-message">
                        <Typography variant="body1">
                            این تیکت بسته شده است. برای باز کردن تیکت، روی دکمه
                            باز کردن تیکت کلیک کنید.
                        </Typography>
                    </div>
                )}
            </div>
        </div>
    );
}
