import { chain, padEnd, map, join } from "lodash";

import { Table, Cell } from "./table";

type Highlight = ((value: string) => string) | undefined;

type Opts = {
	pad?: boolean;
	focusHighlight?: Highlight;
};

const value = (padToLength: number | undefined, focusHighlight: Highlight) => (
	cell: Cell
) =>
	padEnd(
		cell.focused && focusHighlight && cell.value
			? focusHighlight(cell.value)
			: cell.value,
		padToLength
	);

const maxLength = (column: Cell[]) =>
	chain(column)
		.map((cell) => cell.value?.length)
		.max()
		.value();

const values: ({
	pad,
	focusHighlight,
}: {
	pad?: boolean;
	focusHighlight?: (value: string) => string;
}) => (column: Cell[]) => string[] = ({ pad = false, focusHighlight }) => (
	column
) => map(column, value(pad ? maxLength(column) : undefined, focusHighlight));

export const to: (table: Table, opts?: Opts) => string = (
	table,
	opts = { pad: false }
) =>
	chain(table.columns)
		.map(values(opts))
		.unzip() // transpose columns -> rows
		.map((row) => join(row, "|"))
		.map((r) => `|${r}|`)
		.join("\n")
		.value();
