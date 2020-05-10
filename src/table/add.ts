import { times, stubObject } from "lodash";

import { Table } from "./table";

const emptyColumn = (length: number) => times(length, stubObject);
const height = (table: Table) => table.columns[0].length;
const insert = <T>(arr: T[], at: number, item: T) => arr.splice(at, 0, item);

export const addColumn = (table: Table) => (atColumn: number) => (
	insert(table.columns, atColumn, emptyColumn(height(table))),
	table.focus!.column >= atColumn && table.focus!.column++,
	table
);

export const addRow = (table: Table) => (atRow: number) => (
	table.columns.forEach((column) => insert(column, atRow, stubObject())),
	table.focus!.row >= atRow && table.focus!.row++,
	table
);
