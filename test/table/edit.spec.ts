import test from "ava";

import { editAt } from "../../src/table/edit";
import { cellAt } from "../../src/table/cell-at";

test("cell", (t) => {
	const table = { columns: [[{ value: "old value" }]] };
	const edit = editAt(table);
	const pos = { column: 0, row: 0 };
	const getValue = () => cellAt(table)(pos).value;

	t.is(getValue(), "old value");

	edit(pos, "new value");

	t.is(getValue(), "new value");
});
