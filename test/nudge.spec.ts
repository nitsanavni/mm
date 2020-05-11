import test from "ava";

import { nudgeRight, nudgeLeft } from "../src/nudge";

test("left - middle", (t) => {
	const a = [1, 2, 3, 4];

	const newIndex = nudgeLeft(a, 1);

	t.deepEqual(a, [2, 1, 3, 4]);
	t.is(newIndex, 0);
});

test("left - edge", (t) => {
	const a = [1, 2, 3, 4];

	const newIndex = nudgeLeft(a, 0);

	t.deepEqual(a, [2, 3, 4, 1]);
	t.is(newIndex, 3);
});

test("right - middle", (t) => {
	const a = [1, 2, 3, 4];

	const newIndex = nudgeRight(a, 1);

	t.deepEqual(a, [1, 3, 2, 4]);
	t.is(newIndex, 2);
});

test("right - edge", (t) => {
	const a = [1, 2, 3, 4];

	const newIndex = nudgeRight(a, 3);

	t.deepEqual(a, [4, 1, 2, 3]);
	t.is(newIndex, 0);
});
