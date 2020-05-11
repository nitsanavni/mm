import test from "ava";

import { Table } from "../../src/table/table";
import { to } from "./to-plain-with-focus";
import { moveRight } from "../../src/table/move";

test("column", (t) => {
	const table: Table = {
		columns: [
			[{ value: "X", focused: true }],
			[{ value: "Y" }],
			[{ value: "Z" }],
		],
		focus: { column: 0, row: 0 },
	};

	t.is(to(table), "|*X*|Y|Z|");
	moveRight(table);
	t.is(to(table), "|Y|*X*|Z|");
	moveRight(table);
	t.is(to(table), "|Y|Z|*X*|");
	moveRight(table);
	t.is(to(table), "|*X*|Y|Z|");
});
