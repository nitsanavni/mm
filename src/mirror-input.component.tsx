import * as React from "react";
import { useState, useEffect } from "react";
import { Text, useInput } from "ink";

export const MirrorInput = () => {
	const [state, setState] = useState("");
	const [takeInput, setTakeInput] = useState(false);

	useEffect(() => {
		if (!takeInput) {
			setTakeInput(true);
		}

		return () => setTakeInput(false);
	}, []);

	useInput((input) => takeInput && setState(input));

	return <Text>{state}</Text>;
};
