import { format } from 'date-fns-jalali';
import { format as formatEn } from 'date-fns';

// Function to format date to Jalali date and time
export const dateTimeFormatter = (date) => {
    return format(new Date(date), 'yyyy/MM/dd - HH:mm');
};

// Function to format date and time to English date and time
export const enDateTimeFormatter = (date) => {
    return formatEn(new Date(date), 'yyyy/MM/dd - HH:mm');
};
