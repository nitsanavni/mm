import { Table, Position } from "./table";
import { cellAt } from "./cell-at";

const go = (table: Table) => (to: Position) => (
	((at) => (
		table.focus && (at(table.focus).focused = false),
		(table.focus = to),
		(at(to).focused = true)
	))(cellAt(table)),
	table
);

type Direction = (table: Table) => (from: Position) => Position;

export type Transform = (table: Table) => Table;

const above: Direction = () => ({ row, column }) => ({
	column,
	row: row === 0 ? 0 : row - 1,
});

export const up: Transform = (table) => (
	go(table)(above(table)(table.focus!)), table
);

const topmost: Direction = () => ({ column }) => ({
	column,
	row: 0,
});

export const top: Transform = (table) => (
	go(table)(topmost(table)(table.focus!)), table
);

const below: Direction = (table) => ({ row, column }) => ({
	column,
	row: row === table.columns[0].length - 1 ? row : row + 1,
});

export const down: Transform = (table) => (
	go(table)(below(table)(table.focus!)), table
);

const bottommost: Direction = (table) => ({ column }) => ({
	column,
	row: table.columns[0].length - 1,
});

export const bottom: Transform = (table) => (
	go(table)(bottommost(table)(table.focus!)), table
);

const leftOf: Direction = () => ({ row, column }: Position) => ({
	column: column === 0 ? 0 : column - 1,
	row,
});

export const left: Transform = (table) => (
	go(table)(leftOf(table)(table.focus!)), table
);

const leftmost: Direction = () => ({ row }) => ({
	column: 0,
	row,
});

export const toLeftmost: Transform = (table) => (
	go(table)(leftmost(table)(table.focus!)), table
);

const rightOf: Direction = (table) => ({ row, column }) => ({
	column: column === table.columns.length - 1 ? column : column + 1,
	row,
});

export const right: Transform = (table: Table) => (
	go(table)(rightOf(table)(table.focus!)), table
);

const rightmost: Direction = (table) => ({ row }) => ({
	column: table.columns.length - 1,
	row,
});

export const toRightmost: Transform = (table: Table) => (
	go(table)(rightmost(table)(table.focus!)), table
);
