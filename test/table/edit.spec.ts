import test from "ava";

import { edit as editFocused, editAt } from "../../src/table/edit";
import { cellAt } from "../../src/table/cell-at";
import { to } from "../../src/table/to-plain";
import { Table } from "../../src/table/table";

test("focused", (t) => {
	const table: Table = {
		columns: [[{ value: "cell 1" }, { value: "cell 2" }]],
		focus: { column: 0, row: 1 },
	};
	const edit = editFocused(table);

	t.is(to(table), "|cell 1|\n|cell 2|");

	edit("new value");

	t.is(to(table), "|cell 1|\n|new value|");
});

test("cell", (t) => {
	const table = { columns: [[{ value: "old value" }]] };
	const edit = editAt(table);
	const pos = { column: 0, row: 0 };
	const getValue = () => cellAt(table)(pos).value;

	t.is(getValue(), "old value");

	edit(pos, "new value");

	t.is(getValue(), "new value");
});
