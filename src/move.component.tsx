import React, { useState, useEffect } from "react";
import { useInput, Box, Text } from "ink";
import { range } from "lodash";

export const Move = ({ w, h }: { w: number; h: number }) => {
	const [x, setX] = useState(0);
	const [y, setY] = useState(0);
	const [takeInput, setTakeInput] = useState(false);

	useEffect(() => {
		if (!takeInput) {
			setTakeInput(true);
		}

		return () => setTakeInput(false);
	}, []);

	useInput((_, key) => {
		if (takeInput) {
			if (key.downArrow) {
				setY(y === h - 1 ? 0 : y + 1);
			} else if (key.upArrow) {
				setY(y === 0 ? h - 1 : y - 1);
			} else if (key.rightArrow) {
				setX(x === w - 1 ? 0 : x + 1);
			} else if (key.leftArrow) {
				setX(x === 0 ? w - 1 : x - 1);
			}
		} else {
			setX(x);
		}
	});

	return (
		<Box flexDirection="column">
			{range(h).map((r) => (
				<Box flexDirection="row" key={`r${r}`}>
					{range(w).map((c) => (
						<Text key={`t${r}${c}`}>{x === c && y === r ? "X" : "O"}</Text>
					))}
				</Box>
			))}
		</Box>
	);
};
