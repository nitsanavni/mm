import { Table, Position } from "./table";

export const cellAt = (table: Table) => (position?: Position) =>
	table.columns[position?.column || 0][position?.row || 0];
