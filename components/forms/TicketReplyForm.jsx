import useCommonHooks from '@/hooks/useCommonHooks';
import FileUploader from '@/components/inputs/FileUploader';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import userReplyToTicket from '@/functions/user/userReplyToTicket';
import clientReplyToTicket from '@/functions/client/clientReplyToTicket';
import OmTextArea from '../inputs/OmTextArea';
import SendIcon from '@mui/icons-material/Send';

const initialValues = {
    body: '',
    attachment: null,
};

const validationSchema = Yup.object({
    body: Yup.string().required('وارد کردن متن ضروری است'),
});

export default function TicketReplyForm(props) {
    const { setDoReload, type, ticketId } = props;

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

    return (
        <Formik
            initialValues={initialValues}
            validate={validate}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
                const data = {
                    body: values.body,
                    attachment: values.attachment ? values.attachment[0] : null,
                    hasAttachment: values.attachment ? true : false,
                    status:
                        type === 'user' ? 'waitingOnClient' : 'waitingOnUser',
                    ticketId: ticketId,
                };
                if (type === 'user') {
                    await userReplyToTicket(dispatch, enqueueSnackbar, data);
                } else {
                    await clientReplyToTicket(dispatch, enqueueSnackbar, data);
                }
                setSubmitting(false);
                resetForm();
                setDoReload(true);
            }}
        >
            {({ isSubmitting }) => (
                <Form className="om-form panel-form">
                    <OmTextArea name="body" label="متن پاسخ*" />

                    <FileUploader title="ضمیمه" name="attachment" number={1} />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        style={{ marginTop: '1rem' }}
                    >
                        <SendIcon />
                        ثبت پاسخ
                    </Button>
                </Form>
            )}
        </Formik>
    );
}
