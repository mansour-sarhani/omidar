import useCommonHooks from '@/hooks/useCommonHooks';
import OmTextInput from '@/components/inputs/OmTextInput';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import Check from '@mui/icons-material/Check';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import clientUpdateProfile from '@/functions/client/clientUpdateProfile';
import OmDatePicker from '../inputs/OmDatePicker';
import OmImage from '../common/OmIamge';
import FileUploader from '../inputs/FileUploader';
import OmAvatar from '../common/OmAvatar';

const initialValues = {
    firstName: '',
    lastName: '',
    nationalId: '',
    fatherName: '',
    motherName: '',
    gender: '',
    dateOfBirth: '',
    email: '',
    mobile: '',
    address: '',
    zipCode: '',
    avatar: null,
};

const validationSchema = Yup.object({
    nationalId: Yup.string().required('وارد کردن کد ملی ضروری است'),
    firstName: Yup.string().required('وارد کردن نام ضروری است'),
    lastName: Yup.string().required('وارد کردن نام خانوادگی ضروری است'),
    email: Yup.string().required('وارد کردن ایمیل ضروری است'),
    mobile: Yup.string().required('وارد کردن شماره موبایل ضروری است'),
});

export default function ClientUpdateProfileForm(props) {
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
                    fatherName:
                        values.fatherName !== currentData.fatherName
                            ? values.fatherName
                            : null,
                    motherName:
                        values.motherName !== currentData.motherName
                            ? values.motherName
                            : null,
                    gender:
                        values.gender !== currentData.gender
                            ? values.gender
                            : null,
                    dateOfBirth:
                        values.dateOfBirth !== currentData.dateOfBirth
                            ? values.dateOfBirth
                            : null,
                    address:
                        values.address !== currentData.address
                            ? values.address
                            : null,
                    zipCode:
                        values.zipCode !== currentData.zipCode
                            ? values.zipCode
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

                await clientUpdateProfile(dispatch, enqueueSnackbar, finalData);
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
                        <OmTextInput name="fatherName" label="نام پدر" />
                        <OmTextInput name="motherName" label="نام مادر" />
                    </div>
                    <div className="panel-grid-two">
                        <OmTextInput name="email" label="ایمیل*" />
                        <OmTextInput name="mobile" label="شماره موبایل*" />
                    </div>
                    <div className="panel-grid-two">
                        <OmDatePicker
                            name="dateOfBirth"
                            label="تاریخ تولد"
                            setFieldValue={setFieldValue}
                            savedValue={values.dateOfBirth}
                        />
                        <FormControl className="om-form-control">
                            <label htmlFor="gender-select" className="om-label">
                                جنسیت
                            </label>
                            <NativeSelect
                                defaultValue={values.gender}
                                inputProps={{
                                    name: 'gender',
                                    id: 'gender-select',
                                }}
                                onChange={(e) => {
                                    handleChange(e);
                                    setFieldValue('gender', e.target.value);
                                }}
                                className="om-select"
                            >
                                <option value="">
                                    جنسیت متقاضی را انتخاب نمایید
                                </option>
                                <option value="male">آقا</option>
                                <option value="female">خانم</option>
                            </NativeSelect>
                        </FormControl>
                    </div>

                    <OmTextInput name="zipCode" label="کد پستی" />
                    <OmTextInput name="address" label="آدرس" />

                    <div className="panel-new-img-container">
                        <OmAvatar width={80} height={80} person={currentData} />
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
