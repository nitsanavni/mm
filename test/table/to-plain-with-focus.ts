import { to as toPlain } from "../../src/table/to-plain";
import { Table } from "../../src/table/table";

export const to = (table: Table) =>
	toPlain(table, { focusHighlight: (v) => `*${v}*` });
