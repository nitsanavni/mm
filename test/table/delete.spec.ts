import test from "ava";

import { Table } from "../../src/table/table";
import { to } from "./to-plain-with-focus";
import { deleteCellValue } from "../../src/table/delete";

test("cell value", (t) => {
	const table: Table = {
		columns: [
			[{ value: "hello" }],
			[{ value: "delete me please", focused: true }],
		],
		focus: { column: 1, row: 0 },
	};

	t.is(to(table), "|hello|*delete me please*|");
	deleteCellValue(table);
	t.is(to(table), "|hello|**|");
});
