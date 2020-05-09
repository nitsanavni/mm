import { Position, Table } from "./table";
import { cellAt } from "./cell-at";

export const editAt = (table: Table) =>
	((at) => (position: Position | undefined, newValue: string) => (
		(at(position).value = newValue), table
	))(cellAt(table));

export const edit = (table: Table) => (newValue: string) =>
	((e) => e(table.focus, newValue))(editAt(table));
