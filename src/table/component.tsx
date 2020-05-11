import React, { memo } from "react";
import { Box } from "ink";
import { first, times } from "lodash";

import { Cell } from "./table";

type Props = {
	doEdit?: boolean;
	columns?: ReadonlyArray<ReadonlyArray<Cell>>;
};

const ColumnSeparator = memo(({ length = 1 }: { length?: number }) => (
	<div>{times(length, () => "|")}</div>
));

export const Table = ({ columns = [[]] }: Props) => (
	<Box flexDirection="row">
		{columns.map((column) => (
			<>
				<ColumnSeparator length={column.length || 1} />
				<div>
					{column.length > 0
						? column.map((cell) =>
								cell.focused ? `*${cell.value}*` : cell.value
						  )
						: "·"}
				</div>
			</>
		))}
		{<ColumnSeparator length={first(columns)!.length || 1} />}
	</Box>
);
