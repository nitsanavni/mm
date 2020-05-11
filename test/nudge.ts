import test from "ava";
import { inspect } from "util";

import { nudgeRight } from "../src/nudge";

test("right", (t) => {
	const a = [1, 2, 3, 4];

	nudgeRight(a, 1);

	t.is(inspect(a), inspect([1, 3, 2, 4]));
});
