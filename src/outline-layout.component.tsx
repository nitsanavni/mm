import React from "react";
import { Box, Color } from "ink";
import InkTextInput from "ink-text-input";
import { map } from "lodash";

import { OutlineNode, Mode } from "./outline";

export const OutlineLayout = ({
	n,
	onChange,
	mode,
	indent = 0,
	indentStep = 0,
}: {
	n: OutlineNode;
	onChange: (value: string) => void;
	mode: Mode;
	indent?: number;
	indentStep?: number;
}) => (
	<Box
		flexDirection="row"
		key={`box ${n.key}`}
		marginLeft={2}
		alignItems="center"
	>
		<Color bold={n.focused}>
			<InkTextInput
				key={`title ${n.key}`}
				focus={n.focused && mode === "edit node"}
				onChange={onChange}
				value={n.label}
			/>
		</Color>
		<Box flexDirection="column">
			{map(n.children, (c) => (
				<OutlineLayout
					n={c}
					{...{ onChange, mode, indent }}
					key={`layout ${c.key}`}
					indent={indent + indentStep}
					indentStep={indentStep}
				/>
			))}
		</Box>
	</Box>
);
