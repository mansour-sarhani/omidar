import useCommonHooks from '@/hooks/useCommonHooks';
import addPaymentToContract from '@/functions/contract/addPaymentToContract';
import OmDatePicker from '@/components/inputs/OmDatePicker';
import FileUploader from '@/components/inputs/FileUploader';
import OmTextInput from '@/components/inputs/OmTextInput';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import AddIcon from '@mui/icons-material/Add';
import FA from '@/utils/localizationFa';

const initialValues = {
    title: '',
    type: '',
    paidAmount: '',
    currency: '',
    dateOfPayment: '',
    paymentMethod: '',
    receipt: null,
};

const validationSchema = Yup.object({
    title: Yup.string().required('وارد کردن عنوان ضروری است'),
});

export default function AddPaymentForm(props) {
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
                    type: values.type,
                    paidAmount: values.paidAmount,
                    currency: values.currency,
                    dateOfPayment: values.dateOfPayment,
                    paymentMethod: values.paymentMethod,
                    receipt: values.receipt ? values.receipt[0] : null,
                    userId: userId,
                    contractId: contractId,
                };
                await addPaymentToContract(dispatch, enqueueSnackbar, data);
                setSubmitting(false);
                resetForm();
                setDoReload(true);
                handleClose(true);
            }}
        >
            {({ values, handleChange, setFieldValue, isSubmitting }) => (
                <Form className="om-form panel-form">
                    <div className="panel-grid-two">
                        <OmTextInput name="title" label="عنوان*" />
                        <FormControl className="om-form-control">
                            <label htmlFor="type-select" className="om-label">
                                نوع سند پرداخت
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
                                    نوع سند پرداخت را انتخاب نمایید
                                </option>
                                <option value={'initialPayment'}>
                                    {FA.paymentType.initialPayment}
                                </option>
                                <option value={'paymentCompletion'}>
                                    {FA.paymentType.paymentCompletion}
                                </option>
                                <option value={'appilicationFee'}>
                                    {FA.paymentType.appilicationFee}
                                </option>
                                <option value={'visaFee'}>
                                    {FA.paymentType.visaFee}
                                </option>
                                <option value={'contractFee'}>
                                    {FA.paymentType.contractFee}
                                </option>
                                <option value={'tuitionFee'}>
                                    {FA.paymentType.tuitionFee}
                                </option>
                                <option value={'translationFee'}>
                                    {FA.paymentType.translationFee}
                                </option>
                                <option value={'languageCourseFee'}>
                                    {FA.paymentType.languageCourseFee}
                                </option>
                                <option value={'leaderService'}>
                                    {FA.paymentType.leaderFee}
                                </option>
                                <option value={'russianVisa'}>
                                    {FA.paymentType.russianVisa}
                                </option>
                                <option value={'deliveryFee'}>
                                    {FA.paymentType.deliveryFee}
                                </option>
                                <option value={'blueDiploma'}>
                                    {FA.paymentType.blueDiploma}
                                </option>
                                <option value={'tomerFee'}>
                                    {FA.paymentType.tomerFee}
                                </option>
                                <option value={'tolkFee'}>
                                    {FA.paymentType.tolkFee}
                                </option>
                                <option value={'HSKFee'}>
                                    {FA.paymentType.HSKFee}
                                </option>
                                <option value={'otherFee'}>
                                    {FA.paymentType.otherFee}
                                </option>
                                <option value={'returned'}>
                                    {FA.paymentType.returned}
                                </option>
                            </NativeSelect>
                        </FormControl>
                    </div>
                    <div className="panel-grid-two">
                        <OmTextInput name="paidAmount" label="مبلغ*" />
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
                                <option value={'IRT'}>تومان</option>
                            </NativeSelect>
                        </FormControl>
                    </div>
                    <div className="panel-grid-two">
                        <FormControl className="om-form-control">
                            <label
                                htmlFor="paymentMethod-select"
                                className="om-label"
                            >
                                نحوه پرداخت
                            </label>
                            <NativeSelect
                                defaultValue={''}
                                inputProps={{
                                    name: 'paymentMethod',
                                    id: 'paymentMethod-select',
                                }}
                                onChange={(e) => {
                                    handleChange(e);
                                    setFieldValue(
                                        'paymentMethod',
                                        e.target.value
                                    );
                                }}
                                className="om-select"
                            >
                                <option value="">
                                    نحوه پرداخت را انتخاب نمایید
                                </option>
                                <option value={'direct'}>
                                    {FA.paymentMethod.direct}
                                </option>
                                <option value={'deposit'}>
                                    {FA.paymentMethod.deposit}
                                </option>
                                <option value={'POS'}>
                                    {FA.paymentMethod.POS}
                                </option>
                            </NativeSelect>
                        </FormControl>
                        <OmDatePicker
                            name="dateOfPayment"
                            label="تاریخ پرداخت"
                            setFieldValue={setFieldValue}
                        />
                    </div>

                    <FileUploader
                        title="سند پرداخت"
                        name="receipt"
                        number={1}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        style={{ marginTop: '1rem' }}
                    >
                        <AddIcon />
                        اضافه کردن پرداخت
                    </Button>
                </Form>
            )}
        </Formik>
    );
}
