import useCommonHooks from '@/hooks/useCommonHooks';
import addOfferToContract from '@/functions/contract/addOfferToContract';
import OmTextInput from '@/components/inputs/OmTextInput';
import OmTextArea from '@/components/inputs/OmTextArea';
import OmDatePicker from '@/components/inputs/OmDatePicker';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';

const initialValues = {
    title: '',
    studyLanguage: '',
    fieldOfStudy: '',
    degree: '',
    intake: '',
    university: '',
    applicationFee: '',
    currency: '',
    description: '',
    interview: '',
    interviewDate: '',
    test: '',
    testDate: '',
    languageReq: '',
    languageReqDate: '',
    deadline: '',
};

const validationSchema = Yup.object({
    title: Yup.string().required('وارد کردن عنوان ضروری است'),
});

export default function AddOfferForm(props) {
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
                    title: values.title,
                    studyLanguage: values.studyLanguage,
                    fieldOfStudy: values.fieldOfStudy,
                    degree: values.degree,
                    intake: values.intake,
                    university: values.university,
                    applicationFee: values.applicationFee,
                    currency: values.currency,
                    description: values.description,
                    interview: values.interview,
                    interviewDate: values.interviewDate,
                    test: values.test,
                    testDate: values.testDate,
                    languageReq: values.languageReq,
                    languageReqDate: values.languageReqDate,
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
                    <div className="panel-grid-three">
                        <OmTextInput name="title" label="عنوان*" />
                        <OmTextInput name="fieldOfStudy" label="رشته" />
                        <OmTextInput name="degree" label="مقطع" />
                    </div>
                    <div className="panel-grid-three">
                        <OmTextInput name="university" label="دانشگاه" />
                        <OmTextInput
                            name="applicationFee"
                            label="شهریه دانشگاه"
                        />
                        <FormControl className="om-form-control">
                            <label
                                htmlFor="currency-select"
                                className="om-label"
                            >
                                واحد پولی
                            </label>
                            <NativeSelect
                                defaultValue={''}
                                inputProps={{
                                    name: 'currency',
                                    id: 'currency-select',
                                }}
                                onChange={(e) => {
                                    handleChange(e);
                                    setFieldValue('currency', e.target.value);
                                }}
                                className="om-select"
                            >
                                <option value="">
                                    واحد پولی را انتخاب نمایید
                                </option>
                                <option value={'EUR'}>یورو</option>
                                <option value={'USD'}>دلار</option>
                            </NativeSelect>

                            <FormHelperText className="om-form-error">
                                <ErrorMessage name={'currency'} />
                            </FormHelperText>
                        </FormControl>
                    </div>

                    <div className="panel-grid-three">
                        <OmTextInput name="studyLanguage" label="زبان تحصیل" />

                        <OmDatePicker
                            name="deadline"
                            label="مهلت ثبت نام"
                            setFieldValue={setFieldValue}
                        />
                    </div>

                    <div className="panel-grid-three">
                        <FormControlLabel
                            className="om-switch-input"
                            style={{ marginBottom: '20px' }}
                            control={
                                <Switch
                                    checked={values.languageReq}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setFieldValue(
                                            'languageReq',
                                            e.target.checked
                                        );
                                    }}
                                    name="languageReq"
                                />
                            }
                            label={
                                values.languageReq ? (
                                    <Typography>
                                        پیش نیاز مدرک زبان{' '}
                                        <strong className="primary-text">
                                            دارد
                                        </strong>
                                    </Typography>
                                ) : (
                                    <Typography>
                                        پیش نیاز مدرک زبان{' '}
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
                        {values.languageReq && (
                            <OmDatePicker
                                name="languageReqDate"
                                label="مهلت برای مدرک زبان"
                                setFieldValue={setFieldValue}
                            />
                        )}

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
