import { Transform } from "./outline";
import { Many } from "lodash";

type Step = { transform: Many<Transform>; extraWait: number } | Many<Transform>;

export type Clip = Readonly<{
	rate: number;
	steps: ReadonlyArray<Step>;
}>;
