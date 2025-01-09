import { dateTimeFormatter } from '@/utils/dateTimeFormatter';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import DoneAllIcon from '@mui/icons-material/DoneAll';

export default function NotificationItem({ item, markAsRead }) {
    return (
        <div
            className={`notification-item ${
                item.isRead ? 'is-read' : 'is-unread'
            }`}
        >
            <div className="notification-item-header">
                <Typography variant="h6">{item.subject}</Typography>

                {item.isRead ? (
                    <Chip label="خوانده شده" color="success" />
                ) : (
                    <Button
                        variant="contained"
                        size="small"
                        color="secondary"
                        onClick={() => markAsRead(item._id)}
                    >
                        <DoneAllIcon />
                        خواندم
                    </Button>
                )}
            </div>
            <div className="notification-item-body">
                <Typography variant="body1">{item.body}</Typography>
                <Typography variant="body2">
                    {dateTimeFormatter(item.createdAt)}
                </Typography>
            </div>
        </div>
    );
}
