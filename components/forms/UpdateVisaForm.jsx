import useCommonHooks from '@/hooks/useCommonHooks';
import FileUploader from '@/components/inputs/FileUploader';
import OmImage from '@/components/common/OmIamge';
import { Formik, Form } from 'formik';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import Check from '@mui/icons-material/Check';
import updateVisa from '@/functions/contract/updateVisa';
import OmDatePicker from '../inputs/OmDatePicker';

const initialValues = {
    visaType: '',
    invLetterType: '',
    issueDate: '',
    expiryDate: '',
    userInvLetterFile: null,
    userVisaFile: null,
};

export default function UpdateVisaForm(props) {
    const {
        handleClose,
        setDoReload,
        userId,
        contractId = null,
        currentData,
    } = props;

    const { dispatch, enqueueSnackbar } = useCommonHooks();

    return (
        <Formik
            initialValues={currentData || initialValues}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
                const data = {
                    visaType:
                        values.visaType !== currentData.visaType
                            ? values.visaType
                            : null,
                    invLetterType:
                        values.invLetterType !== currentData.invLetterType
                            ? values.invLetterType
                            : null,
                    issueDate:
                        values.issueDate !== currentData.issueDate
                            ? values.issueDate
                            : null,
                    expiryDate:
                        values.expiryDate !== currentData.expiryDate
                            ? values.expiryDate
                            : null,

                    userInvLetterFile: values.newUserInvLetterFile
                        ? values.newUserInvLetterFile[0]
                        : null,
                    userVisaFile: values.newUserVisaFile
                        ? values.newUserVisaFile[0]
                        : null,
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
                    contractId: contractId,
                    visaId: currentData._id,
                    userId,
                };

                await updateVisa(dispatch, enqueueSnackbar, finalData);
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
                                defaultValue={values.visaType}
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
                                <option value={'student'}>تحصیلی</option>
                                <option value={'tourist'}>توریستی</option>
                                <option value={'work'}>کاری</option>
                                <option value={'other'}>دیگر</option>
                            </NativeSelect>
                        </FormControl>

                        <FormControl className="om-form-control">
                            <label
                                htmlFor="invLetterType-select"
                                className="om-label"
                            >
                                نوع دعوت نامه
                            </label>
                            <NativeSelect
                                defaultValue={values.invLetterType}
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
                            savedValue={values.issueDate}
                        />
                        <OmDatePicker
                            name="expiryDate"
                            label="تاریخ اتمام ویزا"
                            setFieldValue={setFieldValue}
                            savedValue={values.expiryDate}
                        />
                    </div>

                    <div className="panel-new-img-container">
                        <OmImage
                            name={values.userInvLetterFile}
                            variant="rounded"
                            width={100}
                            height={100}
                        />
                        <FileUploader
                            title="فایل دعوتنامه"
                            name="newUserInvLetterFile"
                            number={1}
                        />
                    </div>

                    <div className="panel-new-img-container">
                        <OmImage
                            name={values.userVisaFile}
                            variant="rounded"
                            width={100}
                            height={100}
                        />
                        <FileUploader
                            title="فایل ویزا"
                            name="newUserVisaFile"
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
                        به روزرسانی ویزا
                    </Button>
                </Form>
            )}
        </Formik>
    );
}
