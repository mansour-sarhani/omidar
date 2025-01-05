import { useState } from 'react';
import useCommonHooks from '@/hooks/useCommonHooks';
import { dateFormatter } from '@/utils/dateFormatter';
import { timeFormatter } from '@/utils/timeFormatter';
import addCommentToDocument from '@/functions/contract/addCommentToDocument';
import OmTextArea from '@/components/inputs/OmTextArea';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Note from '@mui/icons-material/Note';
import AddIcon from '@mui/icons-material/Add';

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

const initialValues = {
    comment: '',
};

const validationSchema = Yup.object({
    comment: Yup.string().required('وارد کردن متن پیام ضروری است'),
});

export default function DocumentCommentModal(props) {
    const [open, setOpen] = useState(false);

    const { document, userId, setDoReload } = props;

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
                                comment: values.comment,
                                documentId: document._id,
                                contractId: document.contractId,
                                userId: userId,
                            };
                            await addCommentToDocument(
                                dispatch,
                                enqueueSnackbar,
                                data
                            );
                            setSubmitting(false);
                            resetForm();
                            setDoReload(true);
                            handleClose(true);
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form className="om-form panel-form">
                                <OmTextArea
                                    name={'comment'}
                                    label={' پیام جدید'}
                                />
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        gap: 1,
                                    }}
                                >
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={isSubmitting}
                                    >
                                        <AddIcon />
                                        ارسال
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={handleClose}
                                    >
                                        بستن
                                    </Button>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Modal>
        </div>
    );
}
