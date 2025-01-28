import useCommonHooks from '@/hooks/useCommonHooks';
import OmTextInput from '@/components/inputs/OmTextInput';
import OmDatePicker from '@/components/inputs/OmDatePicker';
import OmTimePicker from '@/components/inputs/OmTimePicker';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import Check from '@mui/icons-material/Check';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import { useEffect, useState } from 'react';
import getAllCountries from '@/functions/country/getAllCountries';
import updatePickup from '@/functions/contract/updatePickup';
import IsLoading from '../common/IsLoading';

const initialValues = {
    dateOfArival: '',
    timeOfArival: '',
    numberOfPassengers: '',
    originLocation: '',
    pickupLocation: '',
    country: '',
    status: '',
};

const validationSchema = Yup.object({
    dateOfArival: Yup.string().required(
        'وارد کردن تاریخ ورود به مقصد ضروری است'
    ),
});

export default function UpdatePickupForm(props) {
    const [countries, setCountries] = useState(null);

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

    useEffect(() => {
        async function fetchData() {
            await getAllCountries(dispatch, enqueueSnackbar, setCountries);
        }
        fetchData();
    }, [dispatch, enqueueSnackbar]);

    if (countries === null) return <IsLoading isLoading={true} />;

    return (
        <Formik
            initialValues={currentData || initialValues}
            validate={validate}
            validateOnChange={false}
            validateOnBlur={false}
            enableReinitialize={true}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
                const data = {
                    dateOfArival:
                        values.dateOfArival !== currentData.dateOfArival
                            ? values.dateOfArival
                            : null,

                    timeOfArival:
                        values.timeOfArival !== currentData.timeOfArival
                            ? values.timeOfArival
                            : null,

                    originLocation:
                        values.originLocation !== currentData.originLocation
                            ? values.originLocation
                            : null,

                    numberOfPassengers:
                        values.numberOfPassengers !==
                        currentData.numberOfPassengers
                            ? values.numberOfPassengers
                            : null,

                    pickupLocation:
                        values.pickupLocation !== currentData.pickupLocation
                            ? values.pickupLocation
                            : null,

                    country: values.newCountry ? values.newCountry : null,

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
                    pickupId: currentData._id,
                };

                await updatePickup(dispatch, enqueueSnackbar, finalData);
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
                            <option value="processing">در حال اجرا</option>
                            <option value="left">مسافر مبدا رو ترک کرد</option>
                            <option value="arrived">مسافر به مقصد رسید</option>
                            <option value="pickedUp">
                                مسافر به محل اقامت رسید
                            </option>
                            <option value="done">پیکاپ انجام شد</option>
                        </NativeSelect>
                    </FormControl>
                    <div className="panel-grid-two">
                        <OmDatePicker
                            name="dateOfArival"
                            label="تاریخ ورود به شهر مقصد*"
                            setFieldValue={setFieldValue}
                            savedValue={values.dateOfArival}
                        />
                        <OmTimePicker
                            name="timeOfArival"
                            label="زمان ورود به شهر مقصد"
                            setFieldValue={setFieldValue}
                            savedValue={values.timeOfArival}
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
                                defaultValue={values.country._id}
                                inputProps={{
                                    name: 'newCountry',
                                    id: 'newCountry-select',
                                }}
                                onChange={(e) => {
                                    handleChange(e);
                                    setFieldValue('newCountry', e.target.value);
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
                        <Check />
                        به روزرسانی پیکاپ
                    </Button>
                </Form>
            )}
        </Formik>
    );
}
