import useCommonHooks from '@/hooks/useCommonHooks';
import addCountry from '@/functions/country/addCountry';
import OmTextInput from '@/components/inputs/OmTextInput';
import FileUploader from '@/components/inputs/FileUploader';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

const initialValues = {
    nameFarsi: '',
    nameEnglish: '',
    flag: '',
};

const validationSchema = Yup.object({
    nameFarsi: Yup.string().required('وارد کردن نام کشور به فارسی ضروری است'),
    nameEnglish: Yup.string().required(
        'وارد کردن نام کشور به انگلیسی ضروری است'
    ),
});

export default function AddCountryForm(props) {
    const { handleClose, setDoReload } = props;

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
                    nameFarsi: values.nameFarsi,
                    nameEnglish: values.nameEnglish,
                    flag: values.flag[0],
                };
                await addCountry(dispatch, enqueueSnackbar, data);
                setSubmitting(false);
                resetForm();
                setDoReload(true);
                handleClose(true);
            }}
        >
            {({ isSubmitting }) => (
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
                    <FileUploader title="پرچم" name="flag" number={1} />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        style={{ marginTop: '1rem' }}
                    >
                        <AddIcon />
                        ثبت کشور
                    </Button>
                </Form>
            )}
        </Formik>
    );
}
