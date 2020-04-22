import React from "react";
import { Box, Text } from "ink";
import { isEmpty } from "lodash";

import { OutlineNode } from "./outline";

export const PlainOutline = ({ n }: { n?: OutlineNode }) =>
	!n ? (
		<></>
	) : (
		<Box flexDirection="column" marginRight={1}>
			<Text>{isEmpty(n.label) ? "·" : n.label}</Text>
			<Box flexDirection="column">
				{(() => {
					let next = n.firstChild;
					const acc = [];

					while (next) {
						acc.push(
							<Box
								alignItems="center"
								marginLeft={2}
								flexDirection="row"
								key={`o${next.key}`}
							>
								<PlainOutline n={next} />
							</Box>
						);
						next = next.nextSiblin;
					}

					return acc;
				})()}
			</Box>
		</Box>
	);
