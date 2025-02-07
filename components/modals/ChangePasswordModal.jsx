import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { Button, Typography } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import useCommonHooks from '@/hooks/useCommonHooks';
import Check from '@mui/icons-material/Check';
import PasswordIcon from '@mui/icons-material/Password';
import adminUpdateClient from '@/functions/admin/clients/adminUpdateClient';
import adminUpdateUser from '@/functions/admin/users/adminUpdateUser';
import OmPasswordInput from '../inputs/OmPasswordInput';
import userUpdateProfile from '@/functions/user/userUpdateProfile';
import clientUpdateProfile from '@/functions/client/clientUpdateProfile';

const initialValues = {
    password: '',
    confirmPassword: '',
};

const validationSchema = Yup.object({
    password: Yup.string()
        .min(6, 'رمز عبور باید حداقل 6 کاراکتر باشد')
        .required('رمز عبور ضروری است'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'رمز عبور مطابقت ندارد')
        .required('تکرار رمز عبور ضروری است'),
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

function ChangePasswordModal(props) {
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState();

    const { data, type, setDoReload, mode } = props;

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
        setUser(data);
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason && reason == 'backdropClick' && 'escapeKeyDown') return;
        setOpen(false);
    };

    return (
        <div className="password-modal">
            <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={handleClickOpen}
            >
                <PasswordIcon />
                تغییر رمز عبور
            </Button>

            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="password-modal-title"
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
                        id="password-modal-title"
                        onClose={handleClose}
                    >
                        تغییر رمز عبور
                    </BootstrapDialogTitle>
                    {user && (
                        <DialogContent dividers>
                            <Typography gutterBottom variant="h6">
                                شما در حال تغییر رمز عبور{' '}
                                {user.firstName + ' ' + user.lastName} هستید
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
                                    if (mode === 'self') {
                                        if (type === 'user') {
                                            const data = {
                                                password: values.password,
                                            };

                                            await userUpdateProfile(
                                                dispatch,
                                                enqueueSnackbar,
                                                data
                                            );
                                        } else {
                                            const data = {
                                                password: values.password,
                                            };

                                            await clientUpdateProfile(
                                                dispatch,
                                                enqueueSnackbar,
                                                data
                                            );
                                        }
                                    } else {
                                        if (type === 'client') {
                                            const data = {
                                                password: values.password,
                                                clientId: user._id,
                                            };

                                            await adminUpdateClient(
                                                dispatch,
                                                enqueueSnackbar,
                                                data
                                            );
                                        } else {
                                            const data = {
                                                password: values.password,
                                                userId: user._id,
                                            };

                                            await adminUpdateUser(
                                                dispatch,
                                                enqueueSnackbar,
                                                data
                                            );
                                        }
                                    }

                                    setSubmitting(false);
                                    resetForm();
                                    handleClose();
                                    setDoReload(true);
                                }}
                            >
                                {({ isSubmitting }) => (
                                    <Form className="om-form panel-form">
                                        <div className="panel-grid-two">
                                            <OmPasswordInput
                                                name="password"
                                                label="رمز عبور جدید"
                                            />
                                            <OmPasswordInput
                                                name="confirmPassword"
                                                label="تایید رمز عبور جدید"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            disabled={isSubmitting}
                                            style={{ marginTop: '1rem' }}
                                        >
                                            <Check />
                                            به روزرسانی
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

export default ChangePasswordModal;
