import { format } from "date-fns-jalali";

export const dateFormatter = (date) => {
	return format(new Date(date), "yyyy/MM/dd");
};
