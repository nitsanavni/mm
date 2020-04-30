import test from "ava";

import { initWith, next } from "../src/play-control";
import { edit, addChild, nextKey } from "../src/outline";
import { to } from "../src/outline-to-plain";

test("next single step", (t) => {
	const clip = {
		initialState: [edit("the root"), addChild(), edit("child")],
		rate: 0,
		steps: [edit("modified child")],
	};

	const { o, nextStep } = initWith(clip);

	t.is(to(o), "the root\n  child");

	const { o: nextO } = next({ o, clip, nextStep });

	t.is(to(nextO), "the root\n  modified child");
});

test("initWith children", (t) => {
	const { o } = initWith({
		initialState: [edit("the root"), addChild(), edit("child")],
		rate: 0,
		steps: [],
	});

	t.is(to(o), "the root\n  child");
});

test("initWith empty clip", (t) => {
	const { o } = initWith({
		initialState: [edit("the root")],
		rate: 0,
		steps: [],
	});

	t.is(to(o), "the root");
});
