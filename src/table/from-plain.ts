import { chain, trim } from "lodash";

import { Table } from "./table";
import { left } from "./browse";

export const from: (plain: string) => Table = (plain: string) =>
	left({
		columns: chain(plain)
			.split("\n")
			.map((row) =>
				row
					.substr(1, row.length - 2)
					.split("|")
					.map(trim)
			)
			.unzip()
			.map((column) => column.map((value) => ({ value })))
			.value(),
		focus: { column: 0, row: 0 },
	});
