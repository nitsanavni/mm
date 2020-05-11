import test from "ava";

import { Table } from "../../src/table/table";
import { to } from "./to-plain-with-focus";
import {
	deleteCellValue,
	deleteColumn,
	deleteRow,
} from "../../src/table/delete";
import { moveDown, moveRight } from "../../src/table/move";
import { init } from "../../src/table/init";

test("row - empty", (t) => {
	const table = init();

	t.is(to(table), "|**|");
	deleteRow(table);
	t.is(to(table), "|**|");
});

test("row - single", (t) => {
	const table: Table = {
		columns: [
			[{ value: "X" }],
			[{ value: "X", focused: true }],
			[{ value: "X" }],
			[{ value: "X" }],
		],
		focus: { column: 1, row: 1 },
	};

	t.is(to(table), "|X|*X*|X|X|");
	deleteRow(table);
	t.is(to(table), "|**|");
});

test("row", (t) => {
	const table = {
		columns: [
			[{ value: "1" }, { value: "X" }, { value: "5" }],
			[{ value: "2" }, { value: "X", focused: true }, { value: "6" }],
			[{ value: "3" }, { value: "X" }, { value: "7" }],
			[{ value: "4" }, { value: "X" }, { value: "8" }],
		],
		focus: { column: 1, row: 1 },
	};

	t.is(to(table), "|1|2|3|4|\n|X|*X*|X|X|\n|5|6|7|8|");
	deleteRow(table);
	t.is(to(table), "|1|*2*|3|4|\n|5|6|7|8|");
});

test("column - single", (t) => {
	const table: Table = {
		columns: [[{ value: "A", focused: true }, { value: "B" }]],
		focus: { column: 0, row: 0 },
	};

	t.is(to(table), "|*A*|\n|B|");
	deleteColumn(table);
	t.is(to(table), "|**|");
});

test("column - empty", (t) => {
	const table = init();

	t.is(to(table), "|**|");
	deleteColumn(table);
	t.is(to(table), "|**|");
});

test("column", (t) => {
	const makeTable: () => Table = () => ({
		columns: [
			[{ value: "1" }, { value: "4" }, { value: "7" }],
			[{ value: "X", focused: true }, { value: "X" }, { value: "X" }],
			[{ value: "2" }, { value: "5" }, { value: "8" }],
			[{ value: "3" }, { value: "6" }, { value: "9" }],
		],
		focus: { column: 1, row: 0 },
	});

	t.is(to(makeTable()), "|1|*X*|2|3|\n|4|X|5|6|\n|7|X|8|9|");
	const table = makeTable();
	deleteColumn(table);
	t.is(to(table), "|*1*|2|3|\n|4|5|6|\n|7|8|9|");
	moveDown(table);
	t.is(to(table), "|4|5|6|\n|*1*|2|3|\n|7|8|9|");
	moveRight(table);
	t.is(to(table), "|5|4|6|\n|2|*1*|3|\n|8|7|9|");
});

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
