import { dateTimeFormatter } from '@/utils/dateTimeFormatter';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckIcon from '@mui/icons-material/Check';
import { useState } from 'react';

export default function NotificationItem({ item, markAsRead }) {
    const [open, setOpen] = useState(false);

    return (
        <div
            className={`notification-item ${
                item.isRead ? 'is-read' : 'is-unread'
            }`}
        >
            <div className="notification-item-header">
                <Typography variant="h6">
                    {item.subject}
                    {!item.isRead && (
                        <Chip
                            label="جدید"
                            color="error"
                            size="small"
                            sx={{ marginRight: 1 }}
                        />
                    )}
                </Typography>

                {item.isRead ? (
                    <Chip
                        label="خوانده شده"
                        color="success"
                        icon={<DoneAllIcon />}
                    />
                ) : open ? (
                    <Button
                        variant="outlined"
                        size="small"
                        color="info"
                        onClick={() => markAsRead(item._id)}
                    >
                        <CheckIcon />
                        خواندم
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        size="small"
                        color="secondary"
                        onClick={() => setOpen(true)}
                    >
                        <VisibilityIcon />
                        مشاهده
                    </Button>
                )}
            </div>
            {open && (
                <div className="notification-item-body">
                    <Typography variant="body1">{item.body}</Typography>
                    <Typography variant="body2">
                        {dateTimeFormatter(item.createdAt)}
                    </Typography>
                </div>
            )}
        </div>
    );
}
