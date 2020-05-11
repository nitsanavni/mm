import { pullAt } from "lodash";

import { Transform } from "./transform";
import { cellAt } from "./cell-at";
import { left, up } from "./browse";
import { reset } from "./init";

export const deleteRow: Transform = (table) =>
	table.columns[0].length === 1
		? reset(table)
		: (table.columns.forEach((column) => pullAt(column, table.focus!.row)),
		  up(table),
		  table);

export const deleteColumn: Transform = (table) =>
	table.columns.length === 1
		? reset(table)
		: (pullAt(table.columns, table.focus!.column), left(table), table);

export const deleteCellValue: Transform = (table) => (
	(cellAt(table)(table.focus!).value = ""), table
);
