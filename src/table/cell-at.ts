import { Table, Position } from "./table";

export const cellAt = (table: Table) => (position: Position) =>
	table.columns[position.column][position.row];
