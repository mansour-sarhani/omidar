import useCommonHooks from '@/hooks/useCommonHooks';
import adminAddClient from '@/functions/admin/clients/adminAddClient';
import OmTextInput from '@/components/inputs/OmTextInput';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

const initialValues = {
    firstName: '',
    lastName: '',
    nationalId: '',
    email: '',
    mobile: '',
};

const validationSchema = Yup.object({
    nationalId: Yup.string().required('وارد کردن کد ملی ضروری است'),
    firstName: Yup.string().required('وارد کردن نام ضروری است'),
    lastName: Yup.string().required('وارد کردن نام خانوادگی ضروری است'),
    email: Yup.string().required('وارد کردن ایمیل ضروری است'),
    mobile: Yup.string().required('وارد کردن شماره موبایل ضروری است'),
});

export default function AddClientForm(props) {
    const { handleClose, setDoReload } = props;

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
                    firstName: values.firstName,
                    lastName: values.lastName,
                    nationalId: values.nationalId,
                    email: values.email,
                    mobile: values.mobile,
                };
                await adminAddClient(dispatch, enqueueSnackbar, data);
                setSubmitting(false);
                resetForm();
                setDoReload(true);
                handleClose(true);
            }}
        >
            {({ isSubmitting }) => (
                <Form className="om-form panel-form">
                    <OmTextInput name="nationalId" label="کد ملی*" />
                    <div className="panel-grid-two">
                        <OmTextInput name="firstName" label="نام*" />
                        <OmTextInput name="lastName" label="نام خانوادگی*" />
                    </div>
                    <div className="panel-grid-two">
                        <OmTextInput name="email" label="ایمیل*" />
                        <OmTextInput name="mobile" label="شماره موبایل*" />
                    </div>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        style={{ marginTop: '1rem' }}
                    >
                        <AddIcon />
                        ثبت متقاضی
                    </Button>
                </Form>
            )}
        </Formik>
    );
}
