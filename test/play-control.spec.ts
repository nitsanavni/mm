import test from "ava";
import { times } from "lodash";

import { next } from "../src/play-control";
import { edit, addChild } from "../src/outline";
import { to } from "../src/outline-to-plain";

test("next single step", (t) => {
	const clip = {
		rate: 0,
		steps: [
			[edit("the root"), addChild(), edit("child")],
			edit("modified child"),
		],
	};

	const expected = ["the root\n  child", "the root\n  modified child"];

	let { o, nextStep } = next({ clip });

	times(
		10,
		(it) => (
			t.is(to(o), expected[it % 2]),
			t.is(nextStep, (it + 1) % 2),
			({ o, nextStep } = next({ o, clip, nextStep }))
		)
	);
});

test("initial step, with children", (t) => {
	const { o } = next({
		clip: { rate: 0, steps: [[edit("the root"), addChild(), edit("child")]] },
	});

	t.is(to(o), "the root\n  child");
});

test("initial step", (t) => {
	const { o } = next({
		clip: { rate: 0, steps: [edit("the root")] },
	});

	t.is(to(o), "the root");
});
