import { Formik, Form } from 'formik';
import userLogin from '@/functions/user/userLogin';
import OmTextInput from '@/components/inputs/OmTextInput';
import OmPasswordInput from '@/components/inputs/OmPasswordInput';
import useCommonHooks from '@/hooks/useCommonHooks';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LoginIcon from '@mui/icons-material/Login';

const initialValues = {
    username: '',
    password: '',
};

export default function UserLoginForm() {
    const { dispatch, enqueueSnackbar, router } = useCommonHooks();

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={async (values, { setSubmitting }) => {
                const data = {
                    username: values.username,
                    password: values.password,
                };
                await userLogin(dispatch, enqueueSnackbar, router, data);
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
