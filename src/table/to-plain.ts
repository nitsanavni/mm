import { chain, padEnd, map, join } from "lodash";

import { Table, Cell } from "./table";

type Opts = {
	pad?: boolean;
};

const value = (padToLength?: number) => (cell: Cell) =>
	padEnd(cell.value, padToLength);

const maxLength = (column: Cell[]) =>
	chain(column)
		.map((cell) => cell.value?.length)
		.max()
		.value();

const values: (pad?: boolean) => (column: Cell[]) => string[] = (
	pad = false
) => (column) => map(column, value(pad ? maxLength(column) : undefined));

export const to: (table: Table, opts?: Opts) => string = (
	table,
	opts = { pad: false }
) =>
	chain(table.columns)
		.map(values(opts.pad))
		.unzip() // transpose columns -> rows
		.map((row) => join(row, "|"))
		.map((r) => `|${r}|`)
		.join("\n")
		.value();
