import { useEffect, useState } from 'react';
import useCommonHooks from '@/hooks/useCommonHooks';
import createContract from '@/functions/contract/createContract';
import adminGetAllClients from '@/functions/admin/clients/adminGetAllClients';
import getAllCountries from '@/functions/country/getAllCountries';
import OmTextInput from '@/components/inputs/OmTextInput';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import AddIcon from '@mui/icons-material/Add';

const initialValues = {
    contractNo: '',
    clientId: '',
    countryId: '',
};

const validationSchema = Yup.object({
    contractNo: Yup.string().required('وارد کردن شماره قرارداد ضروری است'),
    clientId: Yup.string().required('انتخاب متقاضی ضروری است'),
    countryId: Yup.string().required('انتخاب کشور ضروری است'),
});

export default function AddContractForm(props) {
    const [clients, setClients] = useState(null);
    const [countries, setCountries] = useState(null);

    const { handleClose, setDoReload } = props;

    const { dispatch, enqueueSnackbar, userData } = useCommonHooks();

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
    }, [dispatch, enqueueSnackbar]);

    return (
        <Formik
            initialValues={initialValues}
            validate={validate}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
                const data = {
                    contractNo: values.contractNo,
                    clientId: values.clientId,
                    countryId: values.countryId,
                    createdBy: userData._id,
                };
                await createContract(dispatch, enqueueSnackbar, data);
                setSubmitting(false);
                resetForm();
                setDoReload(true);
                handleClose(true);
            }}
        >
            {({ isSubmitting, handleChange, setFieldValue }) => (
                <Form className="om-form panel-form">
                    <OmTextInput name="contractNo" label="شماره قرارداد*" />
                    <div className="panel-grid-two">
                        <FormControl className="om-form-control">
                            <label
                                htmlFor="clientId-select"
                                className="om-label"
                            >
                                متقاضی*
                            </label>
                            <NativeSelect
                                defaultValue={''}
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
                                <option value="">
                                    متقاضی را انتخاب نمایید
                                </option>
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
                                defaultValue={''}
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
                                <option value="">کشور را انتخاب نمایید</option>
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
                        <AddIcon />
                        ثبت قرارداد
                    </Button>
                </Form>
            )}
        </Formik>
    );
}
