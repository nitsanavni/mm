import { Table } from "./table";
import { Transform } from "./transform";
import { nudgeRight } from "../nudge";

export const moveRight: Transform = (table: Table) => (
	(table.focus!.column = nudgeRight(table.columns, table.focus!.column)), table
);
