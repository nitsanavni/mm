import test from "ava";

import { Table } from "../../src/table/table";
import { to as toPlain } from "../../src/table/to-plain";
import { addColumn } from "../../src/table/add";
import { right, down } from "../../src/table/browse";
import { edit } from "../../src/table/edit";

const to = (table: Table) =>
	toPlain(table, { focusHighlight: (v) => `*${v}*` });

test("column", (t) => {
	const table: Table = {
		columns: [[{ value: "1", focused: true }, { value: "2" }]],
		focus: { column: 0, row: 0 },
	};

	t.is(to(table), "|*1*|\n|2|");
	addColumn(table)(1);
	t.is(to(table), "|*1*||\n|2||");
	right(table);
	t.is(to(table), "|1|**|\n|2||");
	edit(table)("3");
	t.is(to(table), "|1|*3*|\n|2||");
	down(table);
	edit(table)("4");
	t.is(to(table), "|1|3|\n|2|*4*|");
});
