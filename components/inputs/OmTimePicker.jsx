'use client';

import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/fa';
import { timeFormatter } from '@/utils/timeFormatter';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

export default function OmTimePicker(props) {
    const [value, setValue] = useState(dayjs(new Date()));

    const { name, label, setFieldValue, savedValue } = props;

    useEffect(() => {
        if (savedValue) {
            const [hours, minutes] = savedValue.split(':');
            const date = dayjs().hour(hours).minute(minutes);
            setValue(date);
        }
    }, [savedValue]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fa">
            <DemoContainer components={['TimePicker']} sx={{ p: 0 }}>
                <div className="om-timepicker-container">
                    <label className="om-label">{label}</label>
                    <TimePicker
                        name={name}
                        value={value}
                        onChange={(newValue) => {
                            setValue(newValue);
                            setFieldValue(
                                name,
                                timeFormatter(new Date(newValue))
                            );
                        }}
                        className="om-time-picker"
                    />
                </div>
            </DemoContainer>
        </LocalizationProvider>
    );
}
