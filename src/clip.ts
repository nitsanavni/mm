import { Transform } from "./outline";

type Step = { transform: Transform; extraWait: number } | Transform;

export type Clip = Readonly<{
	initialState: ReadonlyArray<Transform>;
	rate: number;
	steps: ReadonlyArray<Step>;
}>;
