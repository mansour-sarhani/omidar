import { format } from 'date-fns-jalali';
import { format as formatEn } from 'date-fns';

// Function to format date to Jalali date
export const dateFormatter = (date) => {
    return format(new Date(date), 'yyyy/MM/dd');
};

// Function to format date to English date
export const enDateFormatter = (date) => {
    return formatEn(new Date(date), 'yyyy/MM/dd');
};
