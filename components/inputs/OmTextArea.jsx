import { Field, ErrorMessage } from 'formik';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';

export default function OmTextArea({ name, label, placeholder }) {
    return (
        <FormControl className="om-form-control">
            <label htmlFor={name} className="om-label">
                {label}
            </label>
            <Field
                as="textarea"
                name={name}
                placeholder={placeholder}
                className="om-textarea"
            />
            <FormHelperText className="om-form-error">
                <ErrorMessage name={name} />
            </FormHelperText>
        </FormControl>
    );
}
