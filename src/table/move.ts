// TODO - extract this reduce business
import { reduce } from "lodash";

import { Table } from "./table";
import { Transform } from "./transform";
import { nudgeRight, nudgeLeft } from "../nudge";

export const moveDown: Transform = (table: Table) => (
	(table.focus!.row = reduce(
		table.columns,
		(_, column) => nudgeRight(column, table.focus!.row),
		0
	)),
	table
);

export const moveUp: Transform = (table: Table) => (
	(table.focus!.row = reduce(
		table.columns,
		(_, column) => nudgeLeft(column, table.focus!.row),
		0
	)),
	table
);

export const moveRight: Transform = (table: Table) => (
	(table.focus!.column = nudgeRight(table.columns, table.focus!.column)), table
);

export const moveLeft: Transform = (table: Table) => (
	(table.focus!.column = nudgeLeft(table.columns, table.focus!.column)), table
);
