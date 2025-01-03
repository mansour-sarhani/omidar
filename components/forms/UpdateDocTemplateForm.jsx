import useCommonHooks from '@/hooks/useCommonHooks';
import updateDocTemplate from '@/functions/document/updateDocTemplate';
import OmTextInput from '@/components/inputs/OmTextInput';
import FileUploader from '@/components/inputs/FileUploader';
import OmTextArea from '@/components/inputs/OmTextArea';
import OmImage from '@/components/common/OmIamge';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import Check from '@mui/icons-material/Check';

const initialValues = {
    refNo: '',
    nameFarsi: '',
    nameEnglish: '',
    type: '',
    format: '',
    description: '',
    status: '',
    sample: '',
};

const validationSchema = Yup.object({
    refNo: Yup.string().required('وارد کردن شماره رفرنس ضروری است'),
    nameFarsi: Yup.string().required('وارد کردن نام فایل ضروری است'),
});

export default function UpdateDocTemplateForm(props) {
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
                    refNo:
                        values.refNo !== currentData.refNo
                            ? values.refNo
                            : null,

                    nameFarsi:
                        values.nameFarsi !== currentData.nameFarsi
                            ? values.nameFarsi
                            : null,

                    nameEnglish:
                        values.nameEnglish !== currentData.nameEnglish
                            ? values.nameEnglish
                            : null,

                    type: values.type !== currentData.type ? values.type : null,

                    format:
                        values.format !== currentData.format
                            ? values.format
                            : null,

                    description:
                        values.description !== currentData.description
                            ? values.description
                            : null,

                    status:
                        values.status !== currentData.status
                            ? values.status
                            : null,

                    sample: values.newSample ? values.newSample[0] : null,
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
                    docTemplateId: currentData._id,
                };

                await updateDocTemplate(dispatch, enqueueSnackbar, finalData);
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
                            </NativeSelect>
                        </FormControl>
                        <OmTextInput name="refNo" label="شماره رفرنس*" />
                    </div>
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
                                defaultValue={values.type}
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
                                defaultValue={values.format}
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
                    <div className="panel-new-img-container">
                        <OmImage
                            name={currentData.sample}
                            variant="rounded"
                            width={100}
                            height={100}
                        />
                        <FileUploader
                            title="بارگذاری نمونه جدید"
                            name="newSample"
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
                        به روز رسانی قالب
                    </Button>
                </Form>
            )}
        </Formik>
    );
}
