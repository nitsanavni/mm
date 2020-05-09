import { Position, Table } from "./table";
import { cellAt } from "./cell-at";

export const editAt = (table: Table) =>
	((at) => (position: Position, newValue: string) => (
		(at(position).value = newValue), table
	))(cellAt(table));
