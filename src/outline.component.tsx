import React, { useState, useEffect } from "react";
import {
	init,
	edit,
	addSiblin,
	addChild,
	nextSiblin,
	home,
	previousSiblin,
	parent,
	child,
} from "./outline";
import { OutlineLayout } from "./outline-layout.component";
import { useInput } from "ink";
import { map, range, isEqual } from "lodash";

export const Outline = ({ indent = 0 }: { indent?: number }) => {
	const [{ o }, set] = useState({ o: init() });
	// TODO - need more state - in order to do "back" action while navigating

	// TODO - move this to hoc / wrapper
	const [takeInput, setTakeInput] = useState(false);

	useEffect(() => {
		if (!takeInput) {
			setTakeInput(true);
		}

		return () => setTakeInput(false);
	}, []);

	useInput((input, key) => {
		if (!takeInput) {
			return;
		}

		const charCodes = map(range(input.length), (i) => input.charCodeAt(i));

		// TODO - extract controller
		const tab = () => key.ctrl && isEqual(input, "i");
		const shiftTab = () => key.meta && isEqual(input, "[Z");
		const fnBackspace = () => key.meta && isEqual(input, "[3~");
		const backspace = () => input.charCodeAt(0) === 127;
		const altLeft = () => isEqual(charCodes, [27, 91, 68]);
		const altRight = () => isEqual(charCodes, [27, 91, 67]);
		const altUp = () => isEqual(charCodes, [27, 91, 65]);
		const altDown = () => isEqual(charCodes, [27, 91, 66]);
		const space = () => isEqual(input, " ");
		const altReturn = () => key.meta && input.charCodeAt(0) == 13;

		// console.log(input, charCodes, key);

		if (altReturn()) {
			// does not work
			// set({ o: edit(o.focus.label + "\n")(o) });
		} else if (key.escape && o.mode === "browse") {
			set({ o: home()(o) });
		} else if (tab()) {
			set({ o: { ...addChild()(o), mode: "edit node" } });
		} else if (key.downArrow) {
			if (o.mode === "browse") {
				set({ o: { ...nextSiblin()(o), mode: "browse" } });
			}
		} else if (key.upArrow) {
			if (o.mode === "browse") {
				set({ o: { ...previousSiblin()(o), mode: "browse" } });
			}
		} else if (key.leftArrow) {
			if (o.mode === "browse") {
				set({ o: { ...parent()(o), mode: "browse" } });
			}
		} else if (key.rightArrow) {
			if (o.mode === "browse") {
				set({ o: { ...child()(o), mode: "browse" } });
			}
		} else if (key.return) {
			if (o.mode === "edit node") {
				set({ o: { ...o, mode: "browse" } });
			} else {
				set({ o: { ...addSiblin()(o), mode: "edit node" } });
			}
		}
	});

	return (
		<OutlineLayout
			n={o.root}
			// TODO - also disallow shift+tab, it messes up the graph
			onChange={(value) =>
				!value.includes("\t") &&
				!value.includes("[Z") &&
				set({ o: edit(value)(o) })
			}
			mode={o.mode}
			indent={0}
			indentStep={indent}
		/>
	);
};
