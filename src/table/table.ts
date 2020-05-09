export type Position = {
	column: number;
	row: number;
};

export type Cell = {
	value?: string;
	focused?: boolean;
};

export type Table = {
	// assuming single-line cells, rendering should be thought of in columns
	columns: Cell[][];
	focus?: Position;
	mode?: "edit" | "browse";
};

// TODO
// - collapse
// - type '|' -> starts a new table
// - outline - convertToTable / makeIntoTable
// - toOutline
// - text representation for the saved file - to/from plain text, indent like the other nodes, trim values
// - toCSV() - make it easier to test; so maybe it should be under test/
// - extract key adapter: {... (alt + up arrow): moveRowUp, (up arrow): up ...}
// - cellAt(position)
// - move(fromPostion, toPosition) ??
// - go(fromPostion, toPosition) === changeFocus(from, to)
// - above(postion): Position
// - up = go(focus, above(focus))
// - down = go(focus, below(focus))
// - left = go(focus, leftOf(focus))
// - right = go(focus, rightOf(focus))
// - farRight = go(focus, farRightOf(focus))
// - farLeft = go(focus, farLeftOf(focus))
// - top = go(focus, topOf(focus))
// - bottom = go(focus, bottomOf(focus))
// - addColumn = addColumnRightOf(focus)
// - addColumnLeftOf(focus)
// - addRow = addRowBelow(focus) = each(columns, column => addCellBelow(column, focus.row))
// - addRowAbove(focus)
// - delete = deleteCellValue
// - deleteRow
// - deleteColumn
