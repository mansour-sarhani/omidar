import { dateTimeFormatter } from '@/utils/dateTimeFormatter';
import FA from '@/utils/localizationFa';
import setStatusLabel from '@/utils/setStatusLabel';
import { Button, Chip, Typography } from '@mui/material';

export default function TicketRow(props) {
    const { ticket, type } = props;

    const ticketStatusClass =
        ticket.status === 'waitingOnClient'
            ? 'on-client'
            : ticket.status === 'waitingOnUser'
            ? 'on-user'
            : 'closed';

    return (
        <div className={`ticket-item ${ticketStatusClass}`}>
            <div className="ticket-item-header">
                <div className="ticket-item-date">
                    <div className="ticket-item-date-item">
                        <label>تاریخ ایجاد:</label>
                        <Typography variant="body2">
                            {dateTimeFormatter(ticket.createdAt)}
                        </Typography>
                    </div>
                    <span>|</span>
                    <div className="ticket-item-date-item">
                        <label>آخرین به روزرسانی:</label>
                        <Typography variant="body2">
                            {ticket.updatedAt
                                ? dateTimeFormatter(ticket.updatedAt)
                                : '-'}
                        </Typography>
                    </div>
                </div>
            </div>
            <div className="ticket-item-body">
                <div className="ticket-item-body-text">
                    <Typography variant="body1">{ticket.ticketNo}#</Typography>
                    <span>-</span>
                    <Typography variant="body1">{ticket.title}</Typography>
                </div>
                <div className="ticket-item-body-cta">
                    <div className="ticket-item-priority">
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
                    </div>
                    {setStatusLabel(ticket.status)}
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        href={`/${
                            type === 'admin' ? 'admin' : 'panel'
                        }/ticket/${ticket.ticketNo}`}
                    >
                        مشاهده تیکت
                    </Button>
                </div>
            </div>
        </div>
    );
}
