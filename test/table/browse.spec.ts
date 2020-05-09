import test from "ava";

import { Table } from "../../src/table/table";
import { to as toPlain } from "../../src/table/to-plain";
import { go } from "../../src/table/browse";

const focusHighlight = (value: string) => `*${value}*`;
const to = (table: Table) => toPlain(table, { focusHighlight });

test("go", (t) => {
	const table: Table = {
		columns: [
			[{ value: "A", focused: true }, { value: "C" }],
			[{ value: "B" }, { value: "D" }],
		],
		focus: { column: 0, row: 0 },
	};

	t.is(to(table), "|*A*|B|\n|C|D|");

	go(table)({ column: 1, row: 1 });

	t.is(to(table), "|A|B|\n|C|*D*|");
});
