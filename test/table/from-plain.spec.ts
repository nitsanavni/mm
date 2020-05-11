import test from "ava";

import { init } from "../../src/table/init";
import { to } from "../../src/table/to-plain";
import { from } from "../../src/table/from-plain";

test("padding", (t) => {
	const plain = "| A | |";

	t.is(to(from(plain)), "|A||");
});

test("full", (t) => {
	const plain = "|A|B|C|D|\n|a1|b1|c1|d1|\n|info||hello|table|";

	t.is(to(from(plain)), plain);
});

test("empty cells", (t) => {
	const plain = "|||||\n|||||\n|||||";

	t.is(to(from(plain)), plain);
});

test("empty", (t) => {
	t.is(to(from(to(init()))), to(init()));
});
