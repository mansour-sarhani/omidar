import useCommonHooks from '@/hooks/useCommonHooks';
import adminUpdateUser from '@/functions/admin/users/adminUpdateUser';
import OmTextInput from '@/components/inputs/OmTextInput';
import OmImage from '@/components/common/OmIamge';
import FileUploader from '@/components/inputs/FileUploader';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import Check from '@mui/icons-material/Check';

const initialValues = {
    firstName: '',
    lastName: '',
    username: '',
    nationalId: '',
    email: '',
    mobile: '',
    role: '',
    status: '',
    avatar: '',
};

const validationSchema = Yup.object({
    nationalId: Yup.string().required('وارد کردن کد ملی ضروری است'),
    firstName: Yup.string().required('وارد کردن نام ضروری است'),
    lastName: Yup.string().required('وارد کردن نام خانوادگی ضروری است'),
    email: Yup.string().required('وارد کردن ایمیل ضروری است'),
    mobile: Yup.string().required('وارد کردن شماره موبایل ضروری است'),
    username: Yup.string().required('وارد کردن نام کاربری ضروری است'),
});

export default function AdminUpdateUserForm(props) {
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

                    username:
                        values.username !== currentData.username
                            ? values.username
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
                    role: values.role !== currentData.role ? values.role : null,
                    status:
                        values.status !== currentData.status
                            ? values.status
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
                    userId: currentData._id,
                };

                await adminUpdateUser(dispatch, enqueueSnackbar, finalData);
                setSubmitting(false);
                resetForm();
                setDoReload(true);
                handleClose(true);
            }}
        >
            {({ values, handleChange, setFieldValue, isSubmitting }) => (
                <Form className="om-form panel-form">
                    <div className="panel-grid-two">
                        <FormControl className="om-form-control">
                            <label htmlFor="status-select" className="om-label">
                                وضعیت*
                            </label>
                            <NativeSelect
                                defaultValue={values.status}
                                inputProps={{
                                    name: 'status',
                                    id: 'status-select',
                                }}
                                onChange={(e) => {
                                    handleChange(e);
                                    setFieldValue('status', e.target.value);
                                }}
                                className="om-select"
                            >
                                <option value="active">فعال</option>
                                <option value="inactive">غیر فعال</option>
                                <option value="banned">مسدود شده</option>
                            </NativeSelect>
                        </FormControl>
                        <FormControl className="om-form-control">
                            <label htmlFor="role-select" className="om-label">
                                نقش کاربر*
                            </label>
                            <NativeSelect
                                defaultValue={values.role}
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
                                <option value="admin">ادمین</option>
                                <option value="consultant">مشاور</option>
                                <option value="executive">کارشناس اجرا</option>
                                <option value="chief_executive">
                                    مدیر اجرایی
                                </option>
                            </NativeSelect>
                        </FormControl>
                    </div>
                    <div className="panel-grid-two">
                        <OmTextInput name="nationalId" label="کد ملی*" />
                        <OmTextInput name="username" label="نام کاربری*" />
                    </div>
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
                        به روزرسانی کاربر
                    </Button>
                </Form>
            )}
        </Formik>
    );
}
