import useCommonHooks from '@/hooks/useCommonHooks';
import clientLogin from '@/functions/client/clientLogin';
import OmTextInput from '@/components/inputs/OmTextInput';
import OmPasswordInput from '@/components/inputs/OmPasswordInput';
import { Formik, Form } from 'formik';
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';

const initialValues = {
    username: '',
    password: '',
};

export default function ClientLoginForm() {
    const { dispatch, enqueueSnackbar, router } = useCommonHooks();

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={async (values, { setSubmitting }) => {
                const data = {
                    username: values.username,
                    password: values.password,
                };
                await clientLogin(dispatch, enqueueSnackbar, router, data);
                setSubmitting(false);
            }}
        >
            {({ isSubmitting, values }) => (
                <Form className="om-form auth-form">
                    <OmTextInput name="username" label="نام کاربری" />
                    <OmPasswordInput name="password" label="رمز عبور" />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={
                            isSubmitting || !values.username || !values.password
                        }
                    >
                        <LoginIcon />
                        ورود
                    </Button>
                </Form>
            )}
        </Formik>
    );
}
