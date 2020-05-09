import { chain, map } from "lodash";

import { Table } from "./table";

export const to: (table: Table) => string = (table) =>
	chain(table.columns)
		.unzip() // transpose columns -> rows
		.map((row) =>
			chain(row)
				.map((cell) => cell.value || "")
				.join("|")
		)
		.map((r) => `|${r}|`)
		.join("\n")
		.value();
