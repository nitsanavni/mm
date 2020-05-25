import { useState, useEffect } from "react";
import { useInput } from "ink";

import { Key } from "./key";
import { get } from "./input-map";

export const useKey = (handler: (key: Key) => void) => {
	const [takeInput, setTakeInput] = useState(false);

	useEffect(() => {
		if (!takeInput) {
			setTakeInput(true);
		}

		return () => setTakeInput(false);
	}, []);

	// TODO - extract custom hook
	useInput((input, key) => {
		if (!takeInput) {
			return;
		}

		if (key.escape) {
			handler("escape");
		} else if (key.downArrow) {
			handler("down");
		} else if (key.upArrow) {
			handler("up");
		} else if (key.leftArrow) {
			handler("left");
		} else if (key.rightArrow) {
			handler("right");
		} else if (key.return) {
			handler("return");
		} else {
			handler(get({ input, key }));
		}
	});
};
