import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import { useEffect, useState } from 'react';
import getAllUsers from '@/functions/users/getAllUsers';
import addUserToContract from '@/functions/contract/addUserToContract';

const initialValues = {
    userId: '',
};

const validationSchema = Yup.object({
    userId: Yup.string().required('انتخاب کاربر ضروری است'),
});

export default function AddUserToContractForm(props) {
    const [users, setUsers] = useState(null);

    const { handleClose, setDoReload, contractId } = props;

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const user = useSelector((state) => state.user.data);

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
            await getAllUsers(dispatch, enqueueSnackbar, setUsers);
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
                    userId: values.userId,
                    performedBy: user._id,
                    contractId: contractId,
                };
                await addUserToContract(dispatch, enqueueSnackbar, data);
                setSubmitting(false);
                resetForm();
                setDoReload(true);
                handleClose(true);
            }}
        >
            {({ isSubmitting, handleChange, setFieldValue }) => (
                <Form className="om-form panel-form">
                    <FormControl className="om-form-control">
                        <label htmlFor="userId-select" className="om-label">
                            کاربر*
                        </label>
                        <NativeSelect
                            defaultValue={''}
                            inputProps={{
                                name: 'userId',
                                id: 'userId-select',
                            }}
                            onChange={(e) => {
                                handleChange(e);
                                setFieldValue('userId', e.target.value);
                            }}
                            className="om-select"
                        >
                            <option value="">کاربر را انتخاب نمایید</option>
                            {users &&
                                users.map((user) => (
                                    <option key={user._id} value={user._id}>
                                        {user.firstName} {user.lastName}
                                    </option>
                                ))}
                        </NativeSelect>

                        <FormHelperText className="om-form-error">
                            <ErrorMessage name={'userId'} />
                        </FormHelperText>
                    </FormControl>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        style={{ marginTop: '1rem' }}
                    >
                        <AddIcon />
                        اضافه کردن کاربر
                    </Button>
                </Form>
            )}
        </Formik>
    );
}
