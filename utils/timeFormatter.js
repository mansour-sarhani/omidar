import { format } from "date-fns";

export const timeFormatter = (time) => {
	return format(time, "HH:mm");
};
