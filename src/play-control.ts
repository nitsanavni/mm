import { Outline, pipe, init, Transform } from "./outline";
import { Clip } from "./clip";
import { isFunction } from "lodash";

export type Next = {
	o: Outline;
	nextStep: number;
	wait: number;
};

export type Control<T> = (arg: T) => Next;

export const next: Control<{ clip: Clip; o: Outline; nextStep: number }> = ({
	clip,
	o,
	nextStep,
}) => {
	const step = clip.steps[nextStep];

	const restart = nextStep > clip.steps.length - 1;

	if (restart) {
		return initWith(clip);
	}

	const transform: Transform = isFunction(step) ? step : step.transform;

	return {
		o: transform(o),
		nextStep: nextStep + 1,
		wait: clip.rate,
	};
};

export const initWith: Control<Clip> = (clip) => ({
	o: pipe(init())(...clip.initialState),
	nextStep: 0,
	wait: clip.rate,
});
