import { Table, Position } from "./table";
import { cellAt } from "./cell-at";

export const go = (table: Table) => (to: Position) =>
	((at) => (
		table.focus && (at(table.focus).focused = false),
		(table.focus = to),
		(at(to).focused = true)
	))(cellAt(table));
