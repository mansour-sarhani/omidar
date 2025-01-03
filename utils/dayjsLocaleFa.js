import dayjs from "dayjs";
import "dayjs/locale/fa";
import updateLocale from "dayjs/plugin/updateLocale";

dayjs.extend(updateLocale);

dayjs.updateLocale("fa", {
	meridiem: (hour) => {
		return hour < 12 ? "قبل از ظهر" : "بعد از ظهر";
	},
	meridiemParse: /قبل از ظهر|بعد از ظهر/,
	isPM: (input) => input === "بعد از ظهر",
});

export default dayjs;
