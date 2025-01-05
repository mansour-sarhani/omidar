import { useEffect, useState } from 'react';
import useCommonHooks from '@/hooks/useCommonHooks';
import addDocumentToContract from '@/functions/contract/addDocumentToContract';
import getAllDocTemplates from '@/functions/document/getAllDocTemplates';
import OmImage from '@/components/common/OmIamge';
import OmTextArea from '@/components/inputs/OmTextArea';
import OmTextInput from '@/components/inputs/OmTextInput';
import FileUploader from '@/components/inputs/FileUploader';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import AddIcon from '@mui/icons-material/Add';

const initialValues = {
    documentNo: '',
    nameFarsi: '',
    nameEnglish: '',
    type: '',
    format: '',
    description: '',
    status: '',
    sample: null,
    file: null,
};

const validationSchema = Yup.object({
    documentNo: Yup.string().required('وارد کردن شماره فایل ضروری است'),
    nameFarsi: Yup.string().required('وارد کردن نام فایل ضروری است'),
    type: Yup.string().required('وارد کردن نوع فایل ضروری است'),
});

export default function AddDocumentForm(props) {
    const [templates, setTemplates] = useState([]);
    const [savedValues, setSavedValues] = useState(null);

    const {
        handleClose,
        setDoReload,
        uploaderId,
        contractId = null,
        isCheckList,
    } = props;

    const { dispatch, enqueueSnackbar } = useCommonHooks();

    async function handleSelectTemplate(e) {
        const templateId = e.target.value;
        const template = templates.find(
            (template) => template._id === templateId
        );
        setSavedValues(template);

        if (templateId === '') {
            setSavedValues(null);
        }
    }

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

    useEffect(() => {
        async function fetchTemplates() {
            await getAllDocTemplates(dispatch, enqueueSnackbar, setTemplates);
        }
        fetchTemplates();
    }, [dispatch, enqueueSnackbar]);

    return (
        <Formik
            initialValues={savedValues || initialValues}
            validate={validate}
            validateOnChange={false}
            validateOnBlur={false}
            enableReinitialize={true}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
                const data = {
                    documentNo: values.documentNo,
                    nameFarsi: values.nameFarsi,
                    nameEnglish: values.nameEnglish,
                    type: values.type,
                    format: values.format,
                    description: values.description,
                    status: values.status,
                    isCheckList: isCheckList,
                    file: values.file ? values.file[0] : null,
                    sample: values.sample ? values.sample[0] : null,
                    savedSampleUrl: savedValues ? savedValues.sample.url : '',
                    uploadBy: uploaderId,
                    contractId: contractId ? contractId : null,
                };
                await addDocumentToContract(dispatch, enqueueSnackbar, data);
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
                                htmlFor="template-select"
                                className="om-label"
                            >
                                انتخاب از قالبهای موجود
                            </label>
                            <NativeSelect
                                defaultValue={''}
                                disabled={templates.length === 0}
                                inputProps={{
                                    name: 'template',
                                    id: 'template-select',
                                }}
                                onChange={(e) => {
                                    handleSelectTemplate(e);
                                }}
                                className="om-select"
                            >
                                <option value="">
                                    نوع قالب فایل را انتخاب نمایید
                                </option>
                                {templates.map((template) => (
                                    <option
                                        key={template._id}
                                        value={template._id}
                                    >
                                        {template.nameFarsi}
                                    </option>
                                ))}
                            </NativeSelect>
                        </FormControl>
                        <FormControl className="om-form-control">
                            <label htmlFor="status-select" className="om-label">
                                وضعیت
                            </label>
                            <NativeSelect
                                value={values.status}
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
                                <option value="">
                                    وضعیت قالب را انتخاب نمایید
                                </option>
                                <option value="approved">تایید شده</option>
                                <option value="pending">
                                    در انتظار متقاضی
                                </option>
                                <option value="underReview">
                                    در انتظار کارشناس
                                </option>
                            </NativeSelect>
                        </FormControl>
                    </div>

                    <OmTextInput
                        name="documentNo"
                        placeholder={'شماره رفرنس قالب + شماره قرارداد'}
                        label={
                            savedValues
                                ? `شماره فایل* (شماره رفرنس قالب انتخابی: ${savedValues.refNo})`
                                : 'شماره فایل*'
                        }
                    />
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
                                نوع فایل*
                            </label>
                            <NativeSelect
                                value={values.type}
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
                                value={values.format}
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

                    {isCheckList &&
                        (savedValues ? (
                            <Box className="panel-new-img-container">
                                <OmImage
                                    name={savedValues.sample}
                                    variant="rounded"
                                    width={100}
                                    height={100}
                                />
                                <FileUploader
                                    title="نمونه فایل"
                                    name="sample"
                                    number={1}
                                />
                            </Box>
                        ) : (
                            <FileUploader
                                title="نمونه فایل"
                                name="sample"
                                number={1}
                            />
                        ))}
                    {!isCheckList && (
                        <FileUploader
                            title="فایل برای آپلود"
                            name="file"
                            number={1}
                        />
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        style={{ marginTop: '1rem' }}
                    >
                        <AddIcon />
                        اضافه کردن قالب فایل
                    </Button>
                </Form>
            )}
        </Formik>
    );
}
