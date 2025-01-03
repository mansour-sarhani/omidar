import useCommonHooks from '@/hooks/useCommonHooks';
import updateCountry from '@/functions/country/updateCountry';
import OmTextInput from '@/components/inputs/OmTextInput';
import FileUploader from '@/components/inputs/FileUploader';
import OmImage from '@/components/common/OmIamge';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Check from '@mui/icons-material/Check';

const initialValues = {
    nameFarsi: '',
    nameEnglish: '',
    flag: '',
    status: '',
};

const validationSchema = Yup.object({
    nameFarsi: Yup.string().required('وارد کردن نام کشور به فارسی ضروری است'),
    nameEnglish: Yup.string().required(
        'وارد کردن نام کشور به انگلیسی ضروری است'
    ),
});

export default function UpdateCountryForm(props) {
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
                    nameFarsi:
                        values.nameFarsi !== currentData.nameFarsi
                            ? values.nameFarsi
                            : null,
                    nameEnglish:
                        values.nameEnglish !== currentData.nameEnglish
                            ? values.nameEnglish
                            : null,
                    status:
                        values.status !== currentData.status
                            ? values.status
                            : null,
                    flag: values.newFlag ? values.newFlag[0] : null,
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
                    countryId: currentData._id,
                };
                await updateCountry(dispatch, enqueueSnackbar, finalData);
                setSubmitting(false);
                resetForm();
                setDoReload(true);
                handleClose(true);
            }}
        >
            {({ values, handleChange, setFieldValue, isSubmitting }) => (
                <Form className="om-form panel-form">
                    <div className="panel-grid-two">
                        <OmTextInput
                            name="nameFarsi"
                            label="نام کشور (به فارسی)*"
                        />
                        <OmTextInput
                            name="nameEnglish"
                            label="نام کشور (به انگلیسی)*"
                        />
                    </div>

                    <FormControlLabel
                        className="om-switch-input"
                        style={{ marginBottom: '20px' }}
                        control={
                            <Switch
                                checked={values.status === 'active'}
                                onChange={(e) => {
                                    handleChange(e);
                                    setFieldValue(
                                        'status',
                                        e.target.checked ? 'active' : 'inactive'
                                    );
                                }}
                                name="status"
                            />
                        }
                        label={
                            values.status === 'active' ? (
                                <Typography>
                                    کشور{' '}
                                    <strong className="primary-text">
                                        فعال
                                    </strong>{' '}
                                    است
                                </Typography>
                            ) : (
                                <Typography>
                                    کشور{' '}
                                    <strong className="primary-text">
                                        غیر فعال
                                    </strong>{' '}
                                    است
                                </Typography>
                            )
                        }
                    />
                    <Box className="panel-new-img-container">
                        <OmImage
                            name={currentData.flag}
                            variant="rounded"
                            width={80}
                            height={80}
                        />
                        <FileUploader title="پرچم" name="newFlag" number={1} />
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        style={{ marginTop: '1rem' }}
                    >
                        <Check />
                        به روزرسانی کشور
                    </Button>
                </Form>
            )}
        </Formik>
    );
}
