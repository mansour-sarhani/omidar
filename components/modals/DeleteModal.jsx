import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import BlockIcon from '@mui/icons-material/Block';
import { useState } from 'react';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function DeleteModal(props) {
    const [open, setOpen] = useState(false);

    const { data, handleRemoveItem } = props;

    const handleOpen = () => setOpen(true);
    const handleClose = (event, reason) => {
        if (reason && reason == 'backdropClick' && 'escapeKeyDown') return;
        setOpen(false);
    };

    return (
        <div className="panel-modal">
            <Button
                variant="outlined"
                size="small"
                color="error"
                onClick={handleOpen}
            >
                <BlockIcon />
                حذف
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="delete-modal-title"
                aria-describedby="delete-modal-description"
            >
                <Box sx={style}>
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        textAlign={'center'}
                    >
                        آیا از حذف این مورد اطمینان دارید؟
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 1,
                            marginTop: 2,
                        }}
                    >
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                                handleRemoveItem(data);
                                handleClose();
                            }}
                        >
                            بله
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleClose}
                        >
                            خیر
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}
