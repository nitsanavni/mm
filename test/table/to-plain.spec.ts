import test from "ava";

import { to } from "../../src/table/to-plain";

test("single cell", (t) => {
	t.is(to({ columns: [[{ value: "X" }]] }), "|X|");
});

test("single column", (t) => {
	t.is(to({ columns: [[{ value: "X" }, { value: "Y" }]] }), "|X|\n|Y|");
});

test("multi", (t) => {
	t.is(
		to({
			columns: [
				[{ value: "C1R1" }, { value: "C1R2" }],
				[{ value: "C2R1" }, { value: "C2R2" }],
			],
		}),
		"|C1R1|C2R1|\n|C1R2|C2R2|"
	);
});
