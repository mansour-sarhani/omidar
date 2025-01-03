import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { Formik, Form } from 'formik';
import Button from '@mui/material/Button';
import OmTextInput from '@/components/inputs/OmTextInput';
import Check from '@mui/icons-material/Check';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import OmTextArea from '../inputs/OmTextArea';
import OmDatePicker from '../inputs/OmDatePicker';
import updateOffer from '@/functions/contract/updateOffer';

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
    status: '',
};

export default function UpdateOfferForm(props) {
    const { handleClose, setDoReload, userId, contractId, currentData } = props;

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    return (
        <Formik
            initialValues={currentData || initialValues}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
                const data = {
                    title:
                        values.title !== currentData.title
                            ? values.title
                            : null,

                    university:
                        values.university !== currentData.university
                            ? values.university
                            : null,

                    applicationFee:
                        values.applicationFee !== currentData.applicationFee
                            ? values.applicationFee
                            : null,

                    clientComment:
                        values.clientComment !== currentData.clientComment
                            ? values.clientComment
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

                    deadline:
                        values.deadline !== currentData.deadline
                            ? values.deadline
                            : null,

                    status:
                        values.status !== currentData.status
                            ? values.status
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
                            <option value="">وضعیت آفر را انتخاب نمایید</option>
                            <option value="active">فعال</option>
                            <option value="inactive">غیر فعال</option>
                            <option value="pending">در انتظار متقاضی</option>
                        </NativeSelect>
                    </FormControl>
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
                            savedValue={values.deadline}
                        />
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
                        clientComment="submit"
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
