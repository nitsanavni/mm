import test from "ava";

import { to } from "../../src/table/to-plain";

test("highlight focused", (t) => {
	const table = {
		columns: [
			[{ value: "highlight me", focused: true }, { value: "but not me" }],
		],
	};

	const focusHighlight = (value: string) => `*${value}*`;

	t.is(to(table, { focusHighlight }), "|*highlight me*|\n|but not me|");
});

test("padding", (t) => {
	t.is(
		to(
			{
				columns: [[{ value: "short" }, { value: "l  o  n  g" }]],
			},
			{ pad: true }
		),
		"|short     |\n|l  o  n  g|"
	);
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

test("single column", (t) => {
	t.is(to({ columns: [[{ value: "X" }, { value: "Y" }]] }), "|X|\n|Y|");
});

test("single cell", (t) => {
	t.is(to({ columns: [[{ value: "X" }]] }), "|X|");
});
