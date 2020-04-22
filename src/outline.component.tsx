import React, { useState, useEffect } from "react";
import { map, range, isEqual, noop } from "lodash";
import { useInput } from "ink";
import { readFileSync, writeFile } from "fs";

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
import { OutlineView } from "./outline-view-mode";
import { PlainOutline } from "./plain-outline";
import { from } from "./plain-from-outline";
import { to } from "../test/to-plain-outline";

export const Outline = ({ file }: { file?: string }) => {
	const [{ o }, set] = useState(() => {
		if (file) {
			return { o: from(readFileSync(file).toString()) };
		}

		return { o: init() };
	});

	// file && writeFile(file, to(o), noop);

	const [view, setView] = useState<OutlineView>("tree");
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

		if (isEqual(input, "v") && o.mode === "browse") {
			setView(view === "tree" ? "outline" : "tree");
		} else if (altReturn()) {
			set({ o: { ...o, mode: "edit node" } });
		} else if (key.escape && o.mode === "browse") {
			set({ o: home()(o) });
		} else if (tab()) {
			set({ o: { ...addChild()(o), mode: "edit node" } });
		} else if (key.downArrow) {
			if (o.mode === "browse") {
				set({ o: { ...nextSiblin()(o) } });
			}
		} else if (key.upArrow) {
			if (o.mode === "browse") {
				set({ o: { ...previousSiblin()(o) } });
			}
		} else if (key.leftArrow) {
			if (o.mode === "browse") {
				set({ o: { ...parent()(o) } });
			}
		} else if (key.rightArrow) {
			if (o.mode === "browse") {
				set({ o: { ...child()(o) } });
			}
		} else if (key.return) {
			if (o.mode === "edit node") {
				set({ o: { ...o, mode: "browse" } });
			} else {
				set({ o: { ...addSiblin()(o), mode: "edit node" } });
			}
		}

		// console.log(key, input, charCodes);
	});

	return view === "tree" ? (
		<OutlineLayout
			n={o.root}
			onChange={(value) =>
				!value.includes("\t") &&
				!value.includes("[Z") &&
				set({ o: edit(value)(o) })
			}
			mode={o.mode}
		/>
	) : (
		<PlainOutline n={o.root} />
	);
};
