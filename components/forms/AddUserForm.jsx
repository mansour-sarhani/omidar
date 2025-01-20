import useCommonHooks from '@/hooks/useCommonHooks';
import adminAddUser from '@/functions/admin/users/adminAddUser';
import OmTextInput from '@/components/inputs/OmTextInput';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import AddIcon from '@mui/icons-material/Add';

const initialValues = {
    firstName: '',
    lastName: '',
    nationalId: '',
    email: '',
    mobile: '',
    role: '',
};

const validationSchema = Yup.object({
    role: Yup.string().required('انتخاب نقش کاربر ضروری است'),
    firstName: Yup.string().required('وارد کردن نام ضروری است'),
    lastName: Yup.string().required('وارد کردن نام خانوادگی ضروری است'),
    nationalId: Yup.string().required('وارد کردن کد ملی ضروری است'),
    email: Yup.string().required('وارد کردن ایمیل ضروری است'),
    mobile: Yup.string().required('وارد کردن شماره موبایل ضروری است'),
});

export default function AddUserForm(props) {
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
                    role: values.role,
                };
                await adminAddUser(dispatch, enqueueSnackbar, data);
                setSubmitting(false);
                resetForm();
                setDoReload(true);
                handleClose(true);
            }}
        >
            {({ isSubmitting, handleChange, setFieldValue }) => (
                <Form className="om-form panel-form">
                    <div className="panel-grid-two">
                        <FormControl className="om-form-control">
                            <label htmlFor="role-select" className="om-label">
                                نقش کاربر*
                            </label>
                            <NativeSelect
                                defaultValue={''}
                                inputProps={{
                                    name: 'role',
                                    id: 'role-select',
                                }}
                                onChange={(e) => {
                                    handleChange(e);
                                    setFieldValue('role', e.target.value);
                                }}
                                className="om-select"
                            >
                                <option value="">
                                    نقش کاربر را انتخاب نمایید
                                </option>
                                <option value="admin">ادمین</option>
                                <option value="consultant">مشاور</option>
                                <option value="executive">کارشناس اجرا</option>
                                <option value="chief_executive">
                                    مدیر اجرایی
                                </option>
                            </NativeSelect>

                            <FormHelperText className="om-form-error">
                                <ErrorMessage name={'role'} />
                            </FormHelperText>
                        </FormControl>
                        <OmTextInput name="nationalId" label="کد ملی*" />
                    </div>
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
                        ثبت کاربر
                    </Button>
                </Form>
            )}
        </Formik>
    );
}
