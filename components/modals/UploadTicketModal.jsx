import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { Button, Typography } from '@mui/material';
import { Upload } from '@mui/icons-material';
import FileUploader from '@/components/inputs/FileUploader';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import useCommonHooks from '@/hooks/useCommonHooks';
import Check from '@mui/icons-material/Check';
import clientUploadTicketFile from '@/functions/client/clientUploadTicketFile';

const initialValues = {
    file: null,
};

const validationSchema = Yup.object({
    file: Yup.array()
        .nullable()
        .of(
            Yup.mixed().test(
                'fileType',
                'فقط فرمتهای jpeg - png - tiff - bmp - webp - heic - pdf - zip - rar مجاز هستند.',
                function (value) {
                    if (!value) return false;
                    if (!value.type) return false;
                    if (this.parent.image && this.parent.image[0] !== value)
                        return true;
                    return [
                        'image/jpeg',
                        'image/png',
                        'image/tiff',
                        'image/bmp',
                        'image/webp',
                        'image/heic',
                        'application/pdf',
                        'application/zip',
                        'application/x-zip-compressed',
                        'multipart/x-zip',
                        'application/x-rar-compressed',
                    ].includes(value.type);
                }
            )
        )
        .required('انتخاب فایل ضروری است.'),
});

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '.MuiDialog-paper': {
        maxWidth: 800,
    },
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

function BootstrapDialogTitle(props) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        left: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}

function UploadTicketModal(props) {
    const [open, setOpen] = useState(false);
    const [pickup, setPickup] = useState();

    const { data, contractId, setDoReload } = props;

    const { dispatch, enqueueSnackbar } = useCommonHooks();

    const validate = (values) => {
        const errors = {};
        try {
            validationSchema.validateSync(values, { abortEarly: false });
        } catch (validationErrors) {
            validationErrors.inner.forEach((error) => {
                errors[error.path] = error.message;
                enqueueSnackbar(error.message, { variant: 'error' });
            });
        }
        return errors;
    };

    const handleClickOpen = () => {
        setPickup(data);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className="upload-modal">
            <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={handleClickOpen}
            >
                <Upload />
                آپلود
            </Button>

            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="upload-modal-title"
                open={open}
            >
                <div
                    className="bg-black"
                    style={{
                        width: '600px',
                        maxWidth: '600px',
                        margin: '0',
                    }}
                >
                    <BootstrapDialogTitle
                        id="panel-modal-title"
                        onClose={handleClose}
                    >
                        آپلود فایل توسط متقاضی
                    </BootstrapDialogTitle>
                    {pickup && (
                        <DialogContent dividers>
                            <Typography gutterBottom variant="h6">
                                شما در حال آپلود فایل بلیت هستید.
                            </Typography>

                            <Formik
                                initialValues={initialValues}
                                validate={validate}
                                validateOnChange={false}
                                validateOnBlur={false}
                                onSubmit={async (
                                    values,
                                    { setSubmitting, resetForm }
                                ) => {
                                    const data = {
                                        file: values.file[0],
                                        pickupId: pickup._id,
                                        contractId: contractId,
                                    };
                                    await clientUploadTicketFile(
                                        dispatch,
                                        enqueueSnackbar,
                                        data
                                    );
                                    setSubmitting(false);
                                    resetForm();
                                    handleClose();
                                    setDoReload(true);
                                }}
                            >
                                {({ isSubmitting }) => (
                                    <Form className="om-form panel-form">
                                        <FileUploader
                                            title="فایل"
                                            name="file"
                                            number={1}
                                        />
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            disabled={isSubmitting}
                                            style={{ marginTop: '1rem' }}
                                        >
                                            <Check />
                                            آپلود
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={handleClose}
                                            style={{ marginTop: '1rem' }}
                                        >
                                            <CloseIcon />
                                            انصراف
                                        </Button>
                                    </Form>
                                )}
                            </Formik>
                        </DialogContent>
                    )}
                </div>
            </BootstrapDialog>
        </div>
    );
}

export default UploadTicketModal;
