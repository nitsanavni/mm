import test from "ava";

import { Table } from "../../src/table/table";
import { addColumn, addRow } from "../../src/table/add";
import { right, down, up } from "../../src/table/browse";
import { edit } from "../../src/table/edit";
import { to } from "./to-plain-with-focus";

test("row", (t) => {
	const table: Table = {
		columns: [[{ value: "1", focused: true }]],
		// TODO - this is a recurring pattern;
		//        init the table focused on top-left;
		//        should probably be the default
		focus: { column: 0, row: 0 },
	};

	t.is(to(table), "|*1*|");

	addRow(table)(0);

	t.is(to(table), "||\n|*1*|");

	addColumn(table)(0);

	t.is(to(table), "|||\n||*1*|");

	up(table);
	edit(table)("2");

	t.is(to(table), "||*2*|\n||1|");

	addRow(table)(1);

	t.is(to(table), "||*2*|\n|||\n||1|");
});

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

	addColumn(table)(0);

	t.is(to(table), "||1|3|\n||2|*4*|");

	edit(table)("4'");

	t.is(to(table), "||1|3|\n||2|*4'*|");

	addColumn(table)(2);

	t.is(to(table), "||1||3|\n||2||*4'*|");
});
