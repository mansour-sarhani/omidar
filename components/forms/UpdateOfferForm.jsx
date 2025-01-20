import useCommonHooks from '@/hooks/useCommonHooks';
import updateOffer from '@/functions/contract/updateOffer';
import OmTextInput from '@/components/inputs/OmTextInput';
import OmTextArea from '@/components/inputs/OmTextArea';
import OmDatePicker from '@/components/inputs/OmDatePicker';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import Check from '@mui/icons-material/Check';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

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
    status: '',
};

const validationSchema = Yup.object({
    title: Yup.string().required('وارد کردن عنوان ضروری است'),
});

export default function UpdateOfferForm(props) {
    const { handleClose, setDoReload, userId, contractId, currentData } = props;

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
                    title:
                        values.title !== currentData.title
                            ? values.title
                            : null,

                    studyLanguage:
                        values.studyLanguage !== currentData.studyLanguage
                            ? values.studyLanguage
                            : null,
                    degree:
                        values.degree !== currentData.degree
                            ? values.degree
                            : null,

                    fieldOfStudy:
                        values.fieldOfStudy !== currentData.fieldOfStudy
                            ? values.fieldOfStudy
                            : null,

                    intake:
                        values.intake !== currentData.intake
                            ? values.intake
                            : null,

                    university:
                        values.university !== currentData.university
                            ? values.university
                            : null,

                    applicationFee:
                        values.applicationFee !== currentData.applicationFee
                            ? values.applicationFee
                            : null,

                    currency:
                        values.currency !== currentData.currency
                            ? values.currency
                            : null,

                    description:
                        values.description !== currentData.description
                            ? values.description
                            : null,

                    interview:
                        values.interview !== currentData.interview
                            ? values.interview
                            : null,

                    interviewDate:
                        values.interviewDate !== currentData.interviewDate
                            ? values.interviewDate
                            : null,

                    test: values.test !== currentData.test ? values.test : null,

                    testDate:
                        values.testDate !== currentData.testDate
                            ? values.testDate
                            : null,

                    languageReq:
                        values.languageReq !== currentData.languageReq
                            ? values.languageReq
                            : null,

                    languageReqDate:
                        values.languageReqDate !== currentData.languageReqDate
                            ? values.languageReqDate
                            : null,

                    deadline:
                        values.deadline !== currentData.deadline
                            ? values.deadline
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
                    userId: userId,
                    contractId: contractId,
                    offerId: currentData._id,
                };

                await updateOffer(dispatch, enqueueSnackbar, finalData);
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
                                defaultValue={values.currency}
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
                                <option value={'EUR'}>یورو</option>
                                <option value={'USD'}>دلار</option>
                            </NativeSelect>
                        </FormControl>
                    </div>

                    <div className="panel-grid-three">
                        <OmTextInput name="studyLanguage" label="زبان تحصیل" />

                        <OmDatePicker
                            name="deadline"
                            label="مهلت ثبت نام"
                            setFieldValue={setFieldValue}
                            savedValue={values.deadline}
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
                                savedValue={values.languageReqDate}
                            />
                        )}

                        {values.interview && (
                            <OmDatePicker
                                name="interviewDate"
                                label="تاریخ مصاحبه"
                                setFieldValue={setFieldValue}
                                savedValue={values.interviewDate}
                            />
                        )}

                        {values.test && (
                            <OmDatePicker
                                name="testDate"
                                label="تاریخ آزمون ورودی"
                                setFieldValue={setFieldValue}
                                savedValue={values.testDate}
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
                        <Check />
                        به روزرسانی آفر
                    </Button>
                </Form>
            )}
        </Formik>
    );
}
