import Skeleton from "@mui/material/Skeleton";

export const createSkeletons = (
	number,
	type = "circular",
	width = 40,
	height = 40
) => {
	const skeletons = [];
	for (let i = 0; i < number; i++) {
		skeletons.push(
			<Skeleton key={i} variant={type} width={width} height={height} />
		);
	}
	return skeletons;
};
