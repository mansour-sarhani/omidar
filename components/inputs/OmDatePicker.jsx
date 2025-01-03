import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/fa';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function OmDatePicker(props) {
    const [value, setValue] = useState(dayjs(new Date()));

    const { name, label, setFieldValue, savedValue } = props;

    useEffect(() => {
        if (savedValue) {
            setValue(dayjs(savedValue));
        }
    }, [savedValue]);

    const dateFormatter = (date) => {
        return dayjs(date).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fa">
            <DemoContainer components={['DatePicker']} sx={{ p: 0 }}>
                <div className="om-datepicker-container">
                    <label className="om-label">{label}</label>
                    <DatePicker
                        name={name}
                        defaultValue={new Date()}
                        value={value}
                        onChange={(newValue) => {
                            setValue(newValue);
                            setFieldValue(name, dateFormatter(newValue));
                        }}
                        className="om-date-picker"
                    />
                </div>
            </DemoContainer>
        </LocalizationProvider>
    );
}
