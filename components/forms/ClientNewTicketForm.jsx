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
import clientCreateTicket from '@/functions/client/clientCreateTicket';
import FA from '@/utils/localizationFa';
import getClientContracts from '@/functions/client/getClientContracts';
import FormHelperText from '@mui/material/FormHelperText';

const initialValues = {
    title: '',
    contractId: '',
    priority: '',
    body: '',
    attachment: null,
};

const validationSchema = Yup.object({
    title: Yup.string().required('وارد کردن عنوان تیکت ضروری است'),
    contractId: Yup.string().required('انتخاب قرارداد ضروری است'),
    priority: Yup.string().required('انتخاب اولویت تیکت ضروری است'),
    body: Yup.string().required('وارد کردن متن تیکت ضروری است'),
});

export default function ClientNewTicketForm() {
    const [contracts, setContracts] = useState(null);

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
            await getClientContracts(dispatch, enqueueSnackbar, setContracts);
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
                    contractId: values.contractId,
                    priority: values.priority,
                    body: values.body,
                    attachment: values.attachment ? values.attachment[0] : null,
                    hasAttachment: values.attachment ? true : false,
                };
                await clientCreateTicket(
                    dispatch,
                    enqueueSnackbar,
                    router,
                    data
                );
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
                                htmlFor="contractId-select"
                                className="om-label"
                            >
                                قرارداد*
                            </label>
                            <NativeSelect
                                defaultValue={''}
                                inputProps={{
                                    name: 'contractId',
                                    id: 'contractId-select',
                                }}
                                onChange={(e) => {
                                    handleChange(e);
                                    setFieldValue('contractId', e.target.value);
                                }}
                                className="om-select"
                            >
                                <option value="">
                                    قرارداد را انتخاب نمایید
                                </option>
                                {contracts &&
                                    contracts.map((contract) => (
                                        <option
                                            key={contract._id}
                                            value={contract._id}
                                        >
                                            {contract.contractNo} -{' '}
                                            {contract.countries[0].nameFarsi}
                                        </option>
                                    ))}
                            </NativeSelect>

                            <FormHelperText className="om-form-error">
                                <ErrorMessage name={'contractId'} />
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
