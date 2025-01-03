import { Field, ErrorMessage } from 'formik';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';

export default function OmTextInput({
    name,
    label,
    placeholder,
    disabled = false,
}) {
    return (
        <FormControl className="om-form-control">
            <label htmlFor={name} className="om-label">
                {label}
            </label>
            <Field
                type="text"
                name={name}
                className="om-input"
                placeholder={placeholder}
                disabled={disabled}
            />
            <FormHelperText className="om-form-error">
                <ErrorMessage name={name} />
            </FormHelperText>
        </FormControl>
    );
}
