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
// mvp:
// - type '|' -> starts a new table
// - text representation for the saved file - to/from plain text, indent like the other nodes, trim values
// - extract key adapter: {... (alt + up arrow): moveRowUp, (up arrow): up ...}
// - addColumn & grab it to move
// - addColumn = addColumnRightOf(focus)
// - addColumnLeftOf(focus)
// - addRow = addRowBelow(focus) = each(columns, column => addCellBelow(column, focus.row))
// - addRowAbove(focus)
// not mvp:
// - grab column mode -> now left/right arrows move the column
// - transpose!
// - collapse
//   - keep only first cell
//   - keep only first rows
// - freeze columns/rows :)
// - outline - convertToTable / makeIntoTable
// - toOutline
