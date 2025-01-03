// create a function that takes a value and then show it with a comma after each 3 digits like 2,300,000
export const priceFormatter = (value) => {
	return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
