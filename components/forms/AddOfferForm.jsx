import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import OmTextInput from '@/components/inputs/OmTextInput';
import AddIcon from '@mui/icons-material/Add';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import OmTextArea from '../inputs/OmTextArea';
import addOfferToContract from '@/functions/contract/addOfferToContract';
import OmDatePicker from '../inputs/OmDatePicker';

const initialValues = {
    title: '',
    university: '',
    applicationFee: '',
    clientComment: '',
    description: '',
    interview: '',
    interviewDate: '',
    test: '',
    testDate: '',
    deadline: '',
};

const validationSchema = Yup.object({
    title: Yup.string().required('وارد کردن شماره فایل ضروری است'),
});

export default function AddOfferForm(props) {
    const { handleClose, setDoReload, userId, contractId } = props;

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

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
                    title: values.title,
                    university: values.university,
                    applicationFee: values.applicationFee,
                    clientComment: values.clientComment,
                    description: values.description,
                    interview: values.interview,
                    interviewDate: values.interviewDate,
                    test: values.test,
                    testDate: values.testDate,
                    deadline: values.deadline,
                    userId: userId,
                    contractId: contractId,
                };
                await addOfferToContract(dispatch, enqueueSnackbar, data);
                setSubmitting(false);
                resetForm();
                setDoReload(true);
                handleClose(true);
            }}
        >
            {({ values, handleChange, setFieldValue, isSubmitting }) => (
                <Form className="om-form panel-form">
                    <OmTextInput name="title" label="عنوان*" />
                    <OmTextInput name="university" label="دانشگاه" />
                    <OmTextInput name="applicationFee" label="شهریه دانشگاه" />
                    <OmTextInput name="clientComment" label="نظر متقاضی" />

                    <div className="panel-grid-two">
                        <FormControlLabel
                            className="om-switch-input"
                            style={{ marginBottom: '20px' }}
                            control={
                                <Switch
                                    checked={values.interview}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setFieldValue(
                                            'interview',
                                            e.target.checked
                                        );
                                    }}
                                    name="interview"
                                />
                            }
                            label={
                                values.interview ? (
                                    <Typography>
                                        مصاحبه{' '}
                                        <strong className="primary-text">
                                            دارد
                                        </strong>
                                    </Typography>
                                ) : (
                                    <Typography>
                                        مصاحبه{' '}
                                        <strong className="primary-text">
                                            ندارد
                                        </strong>
                                    </Typography>
                                )
                            }
                        />

                        <FormControlLabel
                            className="om-switch-input"
                            style={{ marginBottom: '20px' }}
                            control={
                                <Switch
                                    checked={values.test}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setFieldValue('test', e.target.checked);
                                    }}
                                    name="test"
                                />
                            }
                            label={
                                values.test ? (
                                    <Typography>
                                        آزمون ورودی{' '}
                                        <strong className="primary-text">
                                            دارد
                                        </strong>
                                    </Typography>
                                ) : (
                                    <Typography>
                                        آزمون ورودی{' '}
                                        <strong className="primary-text">
                                            ندارد
                                        </strong>
                                    </Typography>
                                )
                            }
                        />
                    </div>

                    <div className="panel-grid-three">
                        <OmDatePicker
                            name="deadline"
                            label="مهلت ثبت نام"
                            setFieldValue={setFieldValue}
                        />
                        {values.interview && (
                            <OmDatePicker
                                name="interviewDate"
                                label="تاریخ مصاحبه"
                                setFieldValue={setFieldValue}
                            />
                        )}

                        {values.test && (
                            <OmDatePicker
                                name="testDate"
                                label="تاریخ آزمون ورودی"
                                setFieldValue={setFieldValue}
                            />
                        )}
                    </div>

                    <OmTextArea name="description" label="توضیحات" />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        style={{ marginTop: '1rem' }}
                    >
                        <AddIcon />
                        اضافه کردن آفر
                    </Button>
                </Form>
            )}
        </Formik>
    );
}
