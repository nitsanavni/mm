import React from "react";
import { Box, Color, Text } from "ink";
import InkTextInput from "ink-text-input";
import { isEmpty } from "lodash";

import { OutlineNode, Mode } from "./outline";

export const OutlineLayout = ({
	n,
	onChange,
	mode,
	indent = 0,
	indentStep = 0,
}: {
	n?: OutlineNode;
	onChange: (value: string) => void;
	mode: Mode;
	indent?: number;
	indentStep?: number;
}) =>
	!n ? (
		<></>
	) : (
		<Box
			flexDirection="row"
			key={`box ${n.key}`}
			marginLeft={1}
			marginRight={1}
			alignItems="center"
		>
			<Color bold={n.focused} yellow={n.focused}>
				{n.focused ? (
					<InkTextInput onChange={onChange} value={n.label} />
				) : (
					<Text>{isEmpty(n.label) ? "_" : n.label}</Text>
				)}
			</Color>
			<Box flexDirection="column">
				{(function () {
					let next = n.firstChild;
					const acc = [];

					while (next) {
						acc.push(
							<Box
								alignItems="center"
								marginLeft={1}
								flexDirection="row"
								key={`o${next.key}`}
							>
								<Text>│</Text>
								<OutlineLayout
									n={next}
									{...{ onChange, mode, indent }}
									indent={indent + indentStep}
									indentStep={indentStep}
								/>
							</Box>
						);
						next = next.nextSiblin;
					}

					return acc;
				})()}
			</Box>
		</Box>
	);
