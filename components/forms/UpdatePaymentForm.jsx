import useCommonHooks from '@/hooks/useCommonHooks';
import FileUploader from '@/components/inputs/FileUploader';
import OmImage from '@/components/common/OmIamge';
import { Formik, Form } from 'formik';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import Check from '@mui/icons-material/Check';
import OmDatePicker from '../inputs/OmDatePicker';
import updatePayment from '@/functions/contract/updatePayment';
import OmTextInput from '../inputs/OmTextInput';
import FA from '@/utils/localizationFa';

const initialValues = {
    title: '',
    type: '',
    paidAmount: '',
    currency: '',
    dateOfPayment: '',
    paymentMethod: '',
    status: '',
    receipt: null,
};

export default function UpdatePaymentForm(props) {
    const {
        handleClose,
        setDoReload,
        userId,
        contractId = null,
        currentData,
    } = props;

    const { dispatch, enqueueSnackbar } = useCommonHooks();

    return (
        <Formik
            initialValues={currentData || initialValues}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
                const data = {
                    title:
                        values.title !== currentData.title
                            ? values.title
                            : null,
                    type: values.type !== currentData.type ? values.type : null,
                    paidAmount:
                        values.paidAmount !== currentData.paidAmount
                            ? values.paidAmount
                            : null,
                    currency:
                        values.currency !== currentData.currency
                            ? values.currency
                            : null,

                    dateOfPayment:
                        values.dateOfPayment !== currentData.dateOfPayment
                            ? values.dateOfPayment
                            : null,

                    paymentMethod:
                        values.paymentMethod !== currentData.paymentMethod
                            ? values.paymentMethod
                            : null,

                    status:
                        values.status !== currentData.status
                            ? values.status
                            : null,

                    receipt: values.newReceipt ? values.newReceipt[0] : null,
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
                    contractId: contractId,
                    paymentId: currentData._id,
                    userId,
                };

                await updatePayment(dispatch, enqueueSnackbar, finalData);
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
                            <option value="pending">پرداخت نشده</option>
                            <option value="completed">انجام شده</option>
                        </NativeSelect>
                    </FormControl>
                    <div className="panel-grid-two">
                        <OmTextInput name="title" label="عنوان*" />
                        <FormControl className="om-form-control">
                            <label htmlFor="type-select" className="om-label">
                                نوع سند پرداخت
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
                                defaultValue={values.paymentMethod}
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
                            savedValue={values.dateOfPayment}
                        />
                    </div>

                    <div className="panel-new-img-container">
                        <OmImage
                            name={values.receipt}
                            variant="rounded"
                            width={100}
                            height={100}
                        />
                        <FileUploader
                            title="فایل دعوتنامه"
                            name="newReceipt"
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
                        به روزرسانی پرداخت
                    </Button>
                </Form>
            )}
        </Formik>
    );
}
