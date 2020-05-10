import { Position, Table } from "./table";
import { cellAt } from "./cell-at";

export const editAt = (table: Table) =>
	((at) => (position: Position | undefined, newValue: string) => (
		(at(position).value = newValue), table
	))(cellAt(table));

// TODO - if we reverse the params order, we can pipe this
export const edit = (table: Table) => (newValue: string) =>
	((e) => e(table.focus, newValue))(editAt(table));
