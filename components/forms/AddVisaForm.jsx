import useCommonHooks from '@/hooks/useCommonHooks';
import OmDatePicker from '@/components/inputs/OmDatePicker';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import AddIcon from '@mui/icons-material/Add';
import FileUploader from '../inputs/FileUploader';
import addVisaToContract from '@/functions/contract/addVisaToContract';

const initialValues = {
    visaType: '',
    invLetterType: '',
    issueDate: '',
    expiryDate: '',
    userInvLetterFile: null,
    userVisaFile: null,
};

const validationSchema = Yup.object({
    visaType: Yup.string().required('وارد کردن نوع ویزا ضروری است'),
});

export default function AddVisaForm(props) {
    const { handleClose, setDoReload, userId, contractId } = props;

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
                    visaType: values.visaType,
                    invLetterType: values.invLetterType,
                    issueDate: values.issueDate,
                    expiryDate: values.expiryDate,
                    userInvLetterFile: values.userInvLetterFile
                        ? values.userInvLetterFile[0]
                        : null,
                    userVisaFile: values.userVisaFile
                        ? values.userVisaFile[0]
                        : null,
                    userId: userId,
                    contractId: contractId,
                };
                await addVisaToContract(dispatch, enqueueSnackbar, data);
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
                            <label
                                htmlFor="visaType-select"
                                className="om-label"
                            >
                                نوع ویزا
                            </label>
                            <NativeSelect
                                defaultValue={''}
                                inputProps={{
                                    name: 'visaType',
                                    id: 'visaType-select',
                                }}
                                onChange={(e) => {
                                    handleChange(e);
                                    setFieldValue('visaType', e.target.value);
                                }}
                                className="om-select"
                            >
                                <option value="">
                                    نوع ویزا را انتخاب نمایید
                                </option>
                                <option value={'student'}>تحصیلی</option>
                                <option value={'tourist'}>توریستی</option>
                                <option value={'work'}>کاری</option>
                                <option value={'other'}>دیگر</option>
                            </NativeSelect>

                            <FormHelperText className="om-form-error">
                                <ErrorMessage name={'visaType'} />
                            </FormHelperText>
                        </FormControl>

                        <FormControl className="om-form-control">
                            <label
                                htmlFor="invLetterType-select"
                                className="om-label"
                            >
                                نوع دعوت نامه
                            </label>
                            <NativeSelect
                                defaultValue={''}
                                inputProps={{
                                    name: 'invLetterType',
                                    id: 'invLetterType-select',
                                }}
                                onChange={(e) => {
                                    handleChange(e);
                                    setFieldValue(
                                        'invLetterType',
                                        e.target.value
                                    );
                                }}
                                className="om-select"
                            >
                                <option value="">
                                    نوع دعوت نامه را انتخاب نمایید
                                </option>
                                <option value={'personal'}>شخصی</option>
                                <option value={'tourist'}>توریستی</option>
                                <option value={'commercial'}>تجاری</option>
                                <option value={'JW201'}>JW201</option>
                                <option value={'JW202'}>JW202</option>
                                <option value={'RussiaLetter'}>
                                    دعوتنامه روسیه
                                </option>
                                <option value={'RomaniaLetter'}>
                                    تاییدیه تحصیلی رومانی
                                </option>
                            </NativeSelect>
                        </FormControl>
                    </div>
                    <div className="panel-grid-two">
                        <OmDatePicker
                            name="issueDate"
                            label="تاریخ صدور ویزا"
                            setFieldValue={setFieldValue}
                        />
                        <OmDatePicker
                            name="expiryDate"
                            label="تاریخ اتمام ویزا"
                            setFieldValue={setFieldValue}
                        />
                    </div>
                    <FileUploader
                        title="فایل دعوتنامه"
                        name="userInvLetterFile"
                        number={1}
                    />

                    <FileUploader
                        title="فایل ویزا"
                        name="userVisaFile"
                        number={1}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        style={{ marginTop: '1rem' }}
                    >
                        <AddIcon />
                        اضافه کردن ویزا
                    </Button>
                </Form>
            )}
        </Formik>
    );
}
