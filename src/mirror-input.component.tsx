import * as React from "react";
import { useState, useEffect } from "react";
import { Text, useInput } from "ink";

export const MirrorInput = () => {
	const [state, setState] = useState("");
	const [takeInput, setTakeInput] = useState(false);

	useEffect(() => {
		setTakeInput(true);

		return () => setTakeInput(false);
	});

	useInput((input) => {
		if (takeInput) {
			setState(input);
		}
	});

	return <Text>{state}</Text>;
};
