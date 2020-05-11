import test from "ava";

import { Table } from "../../src/table/table";
import { to } from "./to-plain-with-focus";
import { moveRight, moveLeft, moveUp, moveDown } from "../../src/table/move";

test("row", (t) => {
	const table: Table = {
		columns: [
			[{ value: "A", focused: true }, { value: "C" }, { value: "E" }],
			[{ value: "B" }, { value: "D" }, { value: "F" }],
		],
		focus: { column: 0, row: 0 },
	};

	t.is(to(table), "|*A*|B|\n|C|D|\n|E|F|");
	moveUp(table);
	t.is(to(table), "|C|D|\n|E|F|\n|*A*|B|");
	moveUp(table);
	t.is(to(table), "|C|D|\n|*A*|B|\n|E|F|");
	moveDown(table);
	t.is(to(table), "|C|D|\n|E|F|\n|*A*|B|");
	moveDown(table);
	t.is(to(table), "|*A*|B|\n|C|D|\n|E|F|");
});

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
	moveLeft(table);
	t.is(to(table), "|Y|Z|*X*|");
	moveLeft(table);
	t.is(to(table), "|Y|*X*|Z|");
	moveLeft(table);
	t.is(to(table), "|*X*|Y|Z|");
});
