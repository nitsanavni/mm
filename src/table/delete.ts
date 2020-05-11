import { pullAt } from "lodash";

import { Transform } from "./transform";
import { cellAt } from "./cell-at";
import { left } from "./browse";
import { reset } from "./init";

export const deleteColumn: Transform = (table) =>
	table.columns.length === 1
		? reset(table)
		: (pullAt(table.columns, table.focus!.column), left(table), table);

export const deleteCellValue: Transform = (table) => (
	(cellAt(table)(table.focus!).value = ""), table
);
