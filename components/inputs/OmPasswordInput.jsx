'use client';

import { useState } from 'react';
import { Field, ErrorMessage } from 'formik';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';

export default function OmPasswordInput({ name, label }) {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <FormControl className="om-form-control">
            <label htmlFor={name} className="om-label">
                {label}
            </label>
            <div className="om-password-field">
                <Field
                    type={showPassword ? 'text' : 'password'}
                    name={name}
                    className="om-input"
                />
                <IconButton
                    aria-label="toggle password visibility"
                    aria-describedby="password-helperText"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
            </div>
            <FormHelperText className="om-form-error">
                <ErrorMessage name={name} />
            </FormHelperText>
        </FormControl>
    );
}
