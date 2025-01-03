import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { Formik, Form } from 'formik';
import Button from '@mui/material/Button';
import OmTextInput from '@/components/inputs/OmTextInput';
import FileUploader from '@/components/inputs/FileUploader';
import Check from '@mui/icons-material/Check';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import OmTextArea from '../inputs/OmTextArea';
import { Box } from '@mui/system';
import OmImage from '../common/OmIamge';
import updateDocument from '@/functions/contract/updateDocument';

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

export default function UpdateDocumentForm(props) {
    const {
        handleClose,
        setDoReload,
        uploaderId,
        isCheckList,
        contractId = null,
        currentData,
    } = props;

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    console.log(isCheckList);

    return (
        <Formik
            initialValues={currentData || initialValues}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
                const data = {
                    documentNo:
                        values.documentNo !== currentData.documentNo
                            ? values.documentNo
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
                    isCheckList:
                        values.isCheckList !== isCheckList ? isCheckList : null,

                    sample: values.newSample ? values.newSample[0] : null,
                    file: values.newFile ? values.newFile[0] : null,
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
                    documentId: currentData._id,
                    contractId: contractId ? contractId : null,
                    userId: uploaderId,
                };

                await updateDocument(dispatch, enqueueSnackbar, finalData);
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
                                وضعیت
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
                                <option value="">
                                    وضعیت قالب را انتخاب نمایید
                                </option>
                                <option value="approved">تایید شده</option>
                                <option value="rejected">رد شده</option>
                                <option value="pending">
                                    در انتظار متقاضی
                                </option>
                                <option value="underReview">
                                    در انتظار کارشناس
                                </option>
                            </NativeSelect>
                        </FormControl>
                        <OmTextInput
                            name="documentNo"
                            placeholder={'شماره رفرنس قالب + شماره قرارداد'}
                            label={'شماره فایل'}
                        />
                    </div>
                    <div className="panel-grid-two">
                        <OmTextInput
                            name="nameFarsi"
                            label="نام فایل (به فارسی)"
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

                    {!isCheckList ? (
                        <Box className="panel-new-img-container">
                            <OmImage
                                name={values.file}
                                variant="rounded"
                                width={100}
                                height={100}
                            />
                            <FileUploader
                                title="فایل برای آپلود"
                                name="newFile"
                                number={1}
                            />
                        </Box>
                    ) : (
                        <Box className="panel-new-img-container">
                            <OmImage
                                name={values.sample}
                                variant="rounded"
                                width={100}
                                height={100}
                            />
                            <FileUploader
                                title="نمونه فایل"
                                name="newSample"
                                number={1}
                            />
                        </Box>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        style={{ marginTop: '1rem' }}
                    >
                        <Check />
                        به روزرسانی قالب فایل
                    </Button>
                </Form>
            )}
        </Formik>
    );
}
