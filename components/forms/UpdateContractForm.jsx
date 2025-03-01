import { useEffect, useState } from 'react';
import useCommonHooks from '@/hooks/useCommonHooks';
import updateContract from '@/functions/contract/updateContract';
import adminGetAllClients from '@/functions/admin/clients/adminGetAllClients';
import getAllCountries from '@/functions/country/getAllCountries';
import OmTextInput from '@/components/inputs/OmTextInput';
import OmDatePicker from '@/components/inputs/OmDatePicker';
import IsLoading from '@/components/common/IsLoading';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import Check from '@mui/icons-material/Check';

const initialValues = {
    contractNo: '',
    issueDate: '',
    clientId: '',
    countryId: '',
    status: '',
};

const validationSchema = Yup.object({
    contractNo: Yup.string().required('وارد کردن شماره قرارداد ضروری است'),
    clientId: Yup.string().required('انتخاب متقاضی ضروری است'),
});

export default function UpdateContractForm(props) {
    const [clients, setClients] = useState(null);
    const [countries, setCountries] = useState(null);

    const { handleClose, setDoReload, currentData } = props;

    const { dispatch, enqueueSnackbar, userData } = useCommonHooks();

    initialValues.contractNo = currentData.contractNo;
    initialValues.issueDate = currentData.issueDate;
    initialValues.clientId = currentData.client._id;
    initialValues.countryId = currentData.countries[0]._id;
    initialValues.status = currentData.status;

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
        async function fetchData() {
            await adminGetAllClients(dispatch, enqueueSnackbar, setClients);
            await getAllCountries(dispatch, enqueueSnackbar, setCountries);
        }
        fetchData();
    }, [currentData, dispatch, enqueueSnackbar]);

    if (countries === null || clients === null)
        return <IsLoading isLoading={true} />;

    return (
        <Formik
            initialValues={initialValues}
            validate={validate}
            validateOnChange={false}
            validateOnBlur={false}
            enableReinitialize={true}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
                const data = {
                    contractNo:
                        values.contractNo !== currentData.contractNo
                            ? values.contractNo
                            : null,

                    issueDate:
                        values.issueDate !== currentData.issueDate
                            ? values.issueDate
                            : null,

                    clientId:
                        values.clientId !== currentData.clientId
                            ? values.clientId
                            : null,

                    countryId:
                        values.countryId !== currentData.countryId
                            ? values.countryId
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
                    contractId: currentData._id,
                    userId: userData._id,
                };

                await updateContract(dispatch, enqueueSnackbar, finalData);
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
                            وضعیت*
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
                            <option value="active">فعال</option>
                            <option value="inactive">غیر فعال</option>
                            <option value="processing">در حال اجرا</option>
                            <option value="canceled">کنسل شده</option>
                            <option value="done">انجام شده</option>
                        </NativeSelect>
                    </FormControl>
                    <div className="panel-grid-two">
                        <OmTextInput name="contractNo" label="شماره قرارداد*" />
                        <OmDatePicker
                            name="issueDate"
                            label="تاریخ صدور"
                            savedValue={values.issueDate}
                            setFieldValue={setFieldValue}
                        />
                    </div>
                    <div className="panel-grid-two">
                        <FormControl className="om-form-control">
                            <label
                                htmlFor="clientId-select"
                                className="om-label"
                            >
                                متقاضی*
                            </label>
                            <NativeSelect
                                defaultValue={values.clientId}
                                inputProps={{
                                    name: 'clientId',
                                    id: 'clientId-select',
                                }}
                                onChange={(e) => {
                                    handleChange(e);
                                    setFieldValue('clientId', e.target.value);
                                }}
                                className="om-select"
                            >
                                {clients &&
                                    clients.map((client) => (
                                        <option
                                            key={client._id}
                                            value={client._id}
                                        >
                                            {client.firstName} {client.lastName}
                                        </option>
                                    ))}
                            </NativeSelect>

                            <FormHelperText className="om-form-error">
                                <ErrorMessage name={'clientId'} />
                            </FormHelperText>
                        </FormControl>

                        <FormControl className="om-form-control">
                            <label
                                htmlFor="countryId-select"
                                className="om-label"
                            >
                                کشور*
                            </label>
                            <NativeSelect
                                defaultValue={values.countryId}
                                inputProps={{
                                    name: 'countryId',
                                    id: 'countryId-select',
                                }}
                                onChange={(e) => {
                                    handleChange(e);
                                    setFieldValue('countryId', e.target.value);
                                }}
                                className="om-select"
                            >
                                {countries &&
                                    countries.map((country) => (
                                        <option
                                            key={country._id}
                                            value={country._id}
                                        >
                                            {country.nameFarsi}
                                        </option>
                                    ))}
                            </NativeSelect>

                            <FormHelperText className="om-form-error">
                                <ErrorMessage name={'countryId'} />
                            </FormHelperText>
                        </FormControl>
                    </div>

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        style={{ marginTop: '1rem' }}
                    >
                        <Check />
                        به روز رسانی قرارداد
                    </Button>
                </Form>
            )}
        </Formik>
    );
}
