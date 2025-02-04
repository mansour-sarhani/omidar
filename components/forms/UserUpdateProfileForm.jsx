import useCommonHooks from '@/hooks/useCommonHooks';
import OmTextInput from '@/components/inputs/OmTextInput';
import OmImage from '@/components/common/OmIamge';
import FileUploader from '@/components/inputs/FileUploader';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import Check from '@mui/icons-material/Check';
import userUpdateProfile from '@/functions/user/userUpdateProfile';

const initialValues = {
    firstName: '',
    lastName: '',
    nationalId: '',
    email: '',
    mobile: '',
    avatar: '',
};

const validationSchema = Yup.object({
    nationalId: Yup.string().required('وارد کردن کد ملی ضروری است'),
    firstName: Yup.string().required('وارد کردن نام ضروری است'),
    lastName: Yup.string().required('وارد کردن نام خانوادگی ضروری است'),
    email: Yup.string().required('وارد کردن ایمیل ضروری است'),
    mobile: Yup.string().required('وارد کردن شماره موبایل ضروری است'),
});

export default function UserUpdateProfileForm(props) {
    const { handleClose, setDoReload, currentData } = props;

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
            initialValues={currentData || initialValues}
            validate={validate}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
                const data = {
                    firstName:
                        values.firstName !== currentData.firstName
                            ? values.firstName
                            : null,
                    lastName:
                        values.lastName !== currentData.lastName
                            ? values.lastName
                            : null,
                    nationalId:
                        values.nationalId !== currentData.nationalId
                            ? values.nationalId
                            : null,
                    email:
                        values.email !== currentData.email
                            ? values.email
                            : null,
                    mobile:
                        values.mobile !== currentData.mobile
                            ? values.mobile
                            : null,
                    avatar: values.newAvatar ? values.newAvatar[0] : null,
                };

                function filteredData(data) {
                    const result = {};
                    for (const key in data) {
                        if (data[key] !== null) {
                            result[key] = data[key];
                        }
                    }
                    return result;
                }

                const filtered = filteredData(data);

                const finalData = {
                    ...filtered,
                };

                await userUpdateProfile(dispatch, enqueueSnackbar, finalData);
                setSubmitting(false);
                resetForm();
                setDoReload(true);
                handleClose(true);
            }}
        >
            {({ values, handleChange, setFieldValue, isSubmitting }) => (
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

                    <div className="panel-new-img-container">
                        <OmImage
                            name={currentData.avatar}
                            variant="circle"
                            width={80}
                            height={80}
                        />
                        <FileUploader
                            title="آواتار جدید"
                            name="newAvatar"
                            number={1}
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
                </Form>
            )}
        </Formik>
    );
}
