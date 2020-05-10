import anyTest, { TestInterface } from "ava";

import { Table } from "../../src/table/table";
import { to as toPlain } from "../../src/table/to-plain";
import {
	up,
	top,
	down,
	Transform,
	right,
	left,
	bottom,
	toRightmost,
	toLeftmost,
} from "../../src/table/browse";

// TODO - there's only one test here, no need for typed Context
const test = anyTest as TestInterface<{ table: Table }>;

const focusHighlight = () => "█";
const to = (table: Table) => toPlain(table, { focusHighlight });

const makeTable: () => Table = () => ({
	columns: [
		[{ value: " ", focused: true }, { value: " " }, { value: " " }],
		[{ value: " " }, { value: " " }, { value: " " }],
		[{ value: " " }, { value: " " }, { value: " " }],
		[{ value: " " }, { value: " " }, { value: " " }],
	],
	focus: { column: 0, row: 0 },
});

test.beforeEach((t) => {
	t.context.table = makeTable();
});

test("directional", (t) => {
	const sequence: [string, Transform][] = [
		["|█| | | |\n| | | | |\n| | | | |", up],
		["| | | | |\n|█| | | |\n| | | | |", down],
		["| | | | |\n| | | | |\n|█| | | |", down],
		["| | | | |\n| | | | |\n|█| | | |", down],
		["| | | | |\n| | | | |\n| |█| | |", right],
		["| |█| | |\n| | | | |\n| | | | |", top],
		["|█| | | |\n| | | | |\n| | | | |", left],
		["| | | | |\n| | | | |\n|█| | | |", bottom],
		["| | | | |\n| | | | |\n| | | |█|", toRightmost],
		["| | | | |\n| | | | |\n|█| | | |", toLeftmost],
	];

	sequence.forEach(
		([result, action]) => (
			action(t.context.table), t.is(to(t.context.table), result)
		)
	);
});
