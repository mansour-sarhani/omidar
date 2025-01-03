import useCommonHooks from '@/hooks/useCommonHooks';
import addDocTemplate from '@/functions/document/addDocTemplate';
import OmTextInput from '@/components/inputs/OmTextInput';
import FileUploader from '@/components/inputs/FileUploader';
import OmTextArea from '@/components/inputs/OmTextArea';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import AddIcon from '@mui/icons-material/Add';

const initialValues = {
    refNo: '',
    nameFarsi: '',
    nameEnglish: '',
    type: '',
    format: '',
    description: '',
    sample: '',
};

const validationSchema = Yup.object({
    refNo: Yup.string().required('وارد کردن شماره رفرنس ضروری است'),
    nameFarsi: Yup.string().required('وارد کردن نام فایل ضروری است'),
});

export default function AddDocTemplateForm(props) {
    const { handleClose, setDoReload, uploaderId } = props;

    const { dispatch, enqueueSnackbar, router } = useCommonHooks();

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
                    refNo: values.refNo,
                    nameFarsi: values.nameFarsi,
                    nameEnglish: values.nameEnglish,
                    type: values.type,
                    format: values.format,
                    description: values.description,
                    sample: values.sample[0],
                    uploadBy: uploaderId,
                };
                await addDocTemplate(dispatch, enqueueSnackbar, data);
                setSubmitting(false);
                resetForm();
                setDoReload(true);
                handleClose(true);
            }}
        >
            {({ handleChange, setFieldValue, isSubmitting }) => (
                <Form className="om-form panel-form">
                    <OmTextInput name="refNo" label="شماره رفرنس*" />
                    <div className="panel-grid-two">
                        <OmTextInput
                            name="nameFarsi"
                            label="نام فایل (به فارسی)*"
                        />
                        <OmTextInput
                            name="nameEnglish"
                            label="نام فایل (به انگلیسی)"
                        />
                    </div>
                    <div className="panel-grid-two">
                        <FormControl className="om-form-control">
                            <label htmlFor="type-select" className="om-label">
                                نوع فایل
                            </label>
                            <NativeSelect
                                defaultValue={''}
                                inputProps={{
                                    name: 'type',
                                    id: 'type-select',
                                }}
                                onChange={(e) => {
                                    handleChange(e);
                                    setFieldValue('type', e.target.value);
                                }}
                                className="om-select"
                            >
                                <option value="">
                                    نوع فایل را انتخاب نمایید
                                </option>
                                <option key="image" value="image">
                                    تصویر
                                </option>
                                <option key="sound" value="sound">
                                    فایل صوتی
                                </option>
                                <option key="video" value="video">
                                    فایل ویدیویی
                                </option>
                                <option key="document" value="document">
                                    مدرک
                                </option>
                            </NativeSelect>
                        </FormControl>

                        <FormControl className="om-form-control">
                            <label htmlFor="format-select" className="om-label">
                                فرمت فایل
                            </label>
                            <NativeSelect
                                defaultValue={''}
                                inputProps={{
                                    name: 'format',
                                    id: 'format-select',
                                }}
                                onChange={(e) => {
                                    handleChange(e);
                                    setFieldValue('format', e.target.value);
                                }}
                                className="om-select"
                            >
                                <option value="">
                                    فرمت فایل را انتخاب نمایید
                                </option>
                                <option key="JPG" value="JPG">
                                    JPG
                                </option>
                                <option key="PNG" value="PNG">
                                    PNG
                                </option>
                                <option key="JPEG" value="JPEG">
                                    JPEG
                                </option>
                                <option key="MP3" value="MP3">
                                    MP3
                                </option>
                                <option key="MP4" value="MP4">
                                    MP4
                                </option>
                                <option key="PDF" value="PDF">
                                    PDF
                                </option>
                                <option key="ZIP" value="ZIP">
                                    ZIP
                                </option>
                            </NativeSelect>
                        </FormControl>
                    </div>
                    <OmTextArea name="description" label="توضیحات" />
                    <FileUploader title="نمونه فایل" name="sample" number={1} />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        style={{ marginTop: '1rem' }}
                    >
                        <AddIcon />
                        اضافه کردن نمونه قالب
                    </Button>
                </Form>
            )}
        </Formik>
    );
}
