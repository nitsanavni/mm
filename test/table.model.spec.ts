import test from "ava";

import { Table } from "../src/table/table";
import { to } from "../src/table/to-plain";

test("to plain text - single cell", (t) => {
	t.is(to({ columns: [[{ value: "X" }]] }), "|X|");
});

test("to plain text - single column", (t) => {
	t.is(to({ columns: [[{ value: "X" }, { value: "Y" }]] }), "|X|\n|Y|");
});

test("to plain text - multi", (t) => {
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
