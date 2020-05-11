import { Table } from "./table";
import { Transform } from "./transform";

export const init: () => Table = () => ({
	columns: [[{ focused: true }]],
	focus: { column: 0, row: 0 },
});

export const reset: Transform = (table) => (
	([table.columns, table.focus] = [init().columns, init().focus]), table
);
