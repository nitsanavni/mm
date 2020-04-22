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
}: {
	n?: OutlineNode;
	onChange: (value: string) => void;
	mode: Mode;
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
				{n.focused && mode === "edit node" ? (
					<InkTextInput onChange={onChange} value={n.label} />
				) : (
					<Text>{isEmpty(n.label) ? "·" : n.label}</Text>
				)}
			</Color>
			<Box flexDirection="column">
				{(() => {
					let next = n.firstChild;
					const acc = [];

					const prefixes = {
						first: chalk.bold("╭"),
						middle: chalk.bold(" "),
						last: chalk.bold("╰"),
						single: chalk.bold("─"),
					};

					while (next) {
						const p = [
							[prefixes.middle, prefixes.last],
							[prefixes.first, prefixes.single],
						][next.previousSiblin ? 0 : 1][next.nextSiblin ? 0 : 1];

						acc.push(
							<Box
								alignItems="center"
								marginLeft={1}
								flexDirection="row"
								key={`o${next.key}`}
							>
								<Text>{p}</Text>
								<OutlineLayout n={next} {...{ onChange, mode }} />
							</Box>
						);
						next = next.nextSiblin;
					}

					return acc;
				})()}
			</Box>
		</Box>
	);
