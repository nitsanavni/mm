import arrify from "arrify";
import { get } from "lodash";

import { Outline, pipe, init } from "./outline";
import { Clip } from "./clip";

export type Next = {
	o: Outline;
	nextStep: number;
	wait: number;
};

export type Control<T> = (arg: T) => Next;

export const next: Control<{ clip: Clip; o?: Outline; nextStep?: number }> = ({
	clip,
	o = init(),
	nextStep = 0,
}) => ({
	o: pipe(nextStep === 0 ? init() : o)(
		...arrify(get(clip.steps[nextStep], "transform", clip.steps[nextStep]))
	),
	nextStep: nextStep === clip.steps.length - 1 ? 0 : nextStep + 1,
	wait: clip.rate,
});
