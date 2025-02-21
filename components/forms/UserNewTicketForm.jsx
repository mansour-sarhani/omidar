import { useEffect, useState } from 'react';
import useCommonHooks from '@/hooks/useCommonHooks';
import OmTextArea from '@/components/inputs/OmTextArea';
import OmTextInput from '@/components/inputs/OmTextInput';
import FileUploader from '@/components/inputs/FileUploader';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import AddIcon from '@mui/icons-material/Add';
import FA from '@/utils/localizationFa';
import userCreateTicket from '@/functions/user/userCreateTicket';
import adminGetAllClients from '@/functions/admin/clients/adminGetAllClients';
import { FormHelperText } from '@mui/material';

const initialValues = {
    title: '',
    clientId: '',
    priority: '',
    body: '',
    attachment: null,
};

const validationSchema = Yup.object({
    title: Yup.string().required('وارد کردن عنوان تیکت ضروری است'),
    clientId: Yup.string().required('انتخاب متقاضی ضروری است'),
    priority: Yup.string().required('انتخاب اولویت تیکت ضروری است'),
    body: Yup.string().required('وارد کردن متن تیکت ضروری است'),
});

export default function UserNewTicketForm() {
    const [clients, setClients] = useState(null);

    const { dispatch, enqueueSnackbar, router } = useCommonHooks();

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
        }
        fetchData();
    }, [dispatch, enqueueSnackbar]);

    return (
        <Formik
            initialValues={initialValues}
            validate={validate}
            validateOnChange={false}
            validateOnBlur={false}
            enableReinitialize={true}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
                const data = {
                    title: values.title,
                    clientId: values.clientId,
                    priority: values.priority,
                    body: values.body,
                    attachment: values.attachment ? values.attachment[0] : null,
                    hasAttachment: values.attachment ? true : false,
                };
                await userCreateTicket(dispatch, enqueueSnackbar, router, data);
                setSubmitting(false);
                resetForm();
                setDoReload(true);
                handleClose(true);
            }}
        >
            {({ values, handleChange, setFieldValue, isSubmitting }) => (
                <Form className="om-form panel-form">
                    <OmTextInput name="title" label="عنوان تیکت*" />
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
                                htmlFor="priority-select"
                                className="om-label"
                            >
                                فوریت*
                            </label>
                            <NativeSelect
                                defaultValue={''}
                                inputProps={{
                                    name: 'priority',
                                    id: 'priority-select',
                                }}
                                onChange={(e) => {
                                    handleChange(e);
                                    setFieldValue('priority', e.target.value);
                                }}
                                className="om-select"
                            >
                                <option value="">
                                    فوریت تیکت را انتخاب نمایید
                                </option>
                                <option value={'high'}>
                                    {FA.priority.high}
                                </option>
                                <option value={'medium'}>
                                    {FA.priority.medium}
                                </option>
                                <option value={'low'}>{FA.priority.low}</option>
                            </NativeSelect>

                            <FormHelperText className="om-form-error">
                                <ErrorMessage name={'priority'} />
                            </FormHelperText>
                        </FormControl>
                    </div>

                    <OmTextArea name="body" label="متن تیکت*" />

                    <FileUploader title="ضمیمه" name="attachment" number={1} />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        style={{ marginTop: '1rem' }}
                    >
                        <AddIcon />
                        ثبت
                    </Button>
                </Form>
            )}
        </Formik>
    );
}
