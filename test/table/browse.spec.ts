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

const test = anyTest as TestInterface<{ table: Table }>;

const focusHighlight = () => "X";
const to = (table: Table) => toPlain(table, { focusHighlight });

const makeTable: () => Table = () => ({
	columns: [
		[{ value: "O", focused: true }, { value: "O" }, { value: "O" }],
		[{ value: "O" }, { value: "O" }, { value: "O" }],
		[{ value: "O" }, { value: "O" }, { value: "O" }],
		[{ value: "O" }, { value: "O" }, { value: "O" }],
	],
	focus: { column: 0, row: 0 },
});

test.beforeEach((t) => {
	t.context.table = makeTable();
});

test("directional", (t) => {
	const sequence: [Transform, string][] = [
		[up, "|X|O|O|O|\n|O|O|O|O|\n|O|O|O|O|"],
		[down, "|O|O|O|O|\n|X|O|O|O|\n|O|O|O|O|"],
		[down, "|O|O|O|O|\n|O|O|O|O|\n|X|O|O|O|"],
		[down, "|O|O|O|O|\n|O|O|O|O|\n|X|O|O|O|"],
		[right, "|O|O|O|O|\n|O|O|O|O|\n|O|X|O|O|"],
		[top, "|O|X|O|O|\n|O|O|O|O|\n|O|O|O|O|"],
		[left, "|X|O|O|O|\n|O|O|O|O|\n|O|O|O|O|"],
		[bottom, "|O|O|O|O|\n|O|O|O|O|\n|X|O|O|O|"],
		[toRightmost, "|O|O|O|O|\n|O|O|O|O|\n|O|O|O|X|"],
		[toLeftmost, "|O|O|O|O|\n|O|O|O|O|\n|X|O|O|O|"],
	];

	sequence.forEach(
		([action, result]) => (
			action(t.context.table), t.is(to(t.context.table), result)
		)
	);
});
