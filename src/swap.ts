// https://stackoverflow.com/questions/872310/javascript-swap-array-elements
export const swap = <T>(array: T[], i: number, j: number) => (
	([array[i], array[j]] = [array[j], array[i]]), j
);
