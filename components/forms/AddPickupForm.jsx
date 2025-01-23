import useCommonHooks from '@/hooks/useCommonHooks';
import OmTextInput from '@/components/inputs/OmTextInput';
import OmDatePicker from '@/components/inputs/OmDatePicker';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import AddIcon from '@mui/icons-material/Add';
import addPickupToContract from '@/functions/contract/addPickupToContract';
import OmTimePicker from '../inputs/OmTimePicker';
import { useEffect, useState } from 'react';
import getAllCountries from '@/functions/country/getAllCountries';

const initialValues = {
    dateOfArival: '',
    timeOfArival: '',
    numberOfPassengers: '',
    originLocation: '',
    pickupLocation: '',
    country: '',
};

const validationSchema = Yup.object({
    dateOfArival: Yup.string().required('وارد کردن تاریخ ورود ضروری است'),
});

export default function AddPickupForm(props) {
    const [countries, setCountries] = useState(null);

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

    useEffect(() => {
        async function fetchData() {
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
                    dateOfArival: values.dateOfArival,
                    timeOfArival: values.timeOfArival,
                    numberOfPassengers: values.numberOfPassengers,
                    originLocation: values.originLocation,
                    pickupLocation: values.pickupLocation,
                    country: values.country,
                    userId: userId,
                    contractId: contractId,
                };
                await addPickupToContract(dispatch, enqueueSnackbar, data);
                setSubmitting(false);
                resetForm();
                setDoReload(true);
                handleClose(true);
            }}
        >
            {({ values, handleChange, setFieldValue, isSubmitting }) => (
                <Form className="om-form panel-form">
                    <div className="panel-grid-two">
                        <OmDatePicker
                            name="dateOfArival"
                            label="تاریخ ورود به شهر مقصد*"
                            setFieldValue={setFieldValue}
                        />
                        <OmTimePicker
                            name="timeOfArival"
                            label="زمان ورود به شهر مقصد"
                            setFieldValue={setFieldValue}
                        />
                    </div>
                    <div className="panel-grid-two">
                        <OmTextInput name="originLocation" label="شهر مبدا" />
                        <OmTextInput name="pickupLocation" label="شهر مقصد" />
                    </div>
                    <div className="panel-grid-two">
                        <FormControl className="om-form-control">
                            <label
                                htmlFor="country-select"
                                className="om-label"
                            >
                                کشور
                            </label>
                            <NativeSelect
                                defaultValue={''}
                                inputProps={{
                                    name: 'country',
                                    id: 'country-select',
                                }}
                                onChange={(e) => {
                                    handleChange(e);
                                    setFieldValue('country', e.target.value);
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
                        </FormControl>
                        <OmTextInput
                            name="numberOfPassengers"
                            label="تعداد مسافران"
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        style={{ marginTop: '1rem' }}
                    >
                        <AddIcon />
                        اضافه کردن پیکاپ
                    </Button>
                </Form>
            )}
        </Formik>
    );
}
