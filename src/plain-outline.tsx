import React from "react";
import { Box, Text } from "ink";
import { isEmpty, map } from "lodash";

import { OutlineNode, siblinArray } from "./outline";

export const PlainOutline = ({ n }: { n?: OutlineNode }) =>
	!n ? (
		<></>
	) : (
		<Box flexDirection="column" marginRight={1}>
			<Text>{isEmpty(n.label) ? "·" : n.label}</Text>
			<Box flexDirection="column" paddingLeft={2}>
				{map(siblinArray(n.firstChild), (s) => (
					<PlainOutline n={s} key={`s${s.key}`} />
				))}
			</Box>
		</Box>
	);
