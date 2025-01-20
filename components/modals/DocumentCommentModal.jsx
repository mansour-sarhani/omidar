import { useState } from 'react';
import { dateFormatter } from '@/utils/dateFormatter';
import { timeFormatter } from '@/utils/timeFormatter';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Note from '@mui/icons-material/Note';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function DocumentCommentModal(props) {
    const [open, setOpen] = useState(false);

    const { document } = props;

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div className="panel-modal">
            <Button
                variant="outlined"
                size="small"
                color="info"
                onClick={handleOpen}
            >
                <Note />
                پیام ها
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="document-comment-modal-title"
                aria-describedby="document-comment-modal-description"
            >
                <Box sx={style}>
                    <Typography variant="h6">پیام های چک لیست فایل</Typography>
                    <div className="document-comments-wrapper">
                        {document.comments.length > 0 ? (
                            document.comments.map((comment, index) => (
                                <div
                                    key={index}
                                    className="document-comment-box"
                                >
                                    <div className="document-comment-header">
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {comment.userName}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {timeFormatter(comment.date) +
                                                ' | ' +
                                                dateFormatter(comment.date)}
                                        </Typography>
                                    </div>
                                    <Typography variant="body2">
                                        {comment.body}
                                    </Typography>
                                </div>
                            ))
                        ) : (
                            <Typography variant="body1" color="text.secondary">
                                پیامی برای این فایل ثبت نشده است
                            </Typography>
                        )}
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
