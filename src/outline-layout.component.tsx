import React from "react";
import { Box, Color, Text } from "ink";
import InkTextInput from "ink-text-input";
import { isEmpty } from "lodash";
import chalk from "chalk";

import { OutlineNode, Mode } from "./outline";

export const OutlineLayout = ({
	n,
	onChange,
	mode,
	indent = 0,
	indentStep = 0,
	p = 0,
}: {
	n?: OutlineNode;
	onChange: (value: string) => void;
	mode: Mode;
	indent?: number;
	indentStep?: number;
	p?: number;
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
				{n.focused && mode == "edit node" ? (
					<InkTextInput onChange={onChange} value={n.label} />
				) : (
					<Text>{isEmpty(n.label) ? "·" : n.label}</Text>
				)}
			</Color>
			<Box flexDirection="column">
				{(() => {
					let next = n.firstChild;
					const acc = [];

					const prefixes = [chalk.cyan.bold("│"), chalk.magenta.bold("│")];

					let childP = p;

					while (next) {
						acc.push(
							<Box
								alignItems="center"
								marginLeft={1}
								flexDirection="row"
								key={`o${next.key}`}
							>
								<Text>{prefixes[p]}</Text>
								<OutlineLayout
									n={next}
									{...{ onChange, mode, indent }}
									indent={indent + indentStep}
									indentStep={indentStep}
									p={childP}
								/>
							</Box>
						);
						next = next.nextSiblin;
						childP = 1 - childP;
					}

					return acc;
				})()}
			</Box>
		</Box>
	);
