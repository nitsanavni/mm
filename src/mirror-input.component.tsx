import * as React from "react";
import { useState } from "react";
import { useInput, useStdin, Text } from "ink";

export const MirrorInput = () => {
	const [input, setInput] = useState("");

	const { stdin, isRawModeSupported } = useStdin();

	if (isRawModeSupported) {
		useInput(setInput);
	} else {
		stdin.on("data", (d) => {
			stdin.removeAllListeners("data");
			setInput(d.toString());
		});
	}

	return <Text>{input}</Text>;
};
