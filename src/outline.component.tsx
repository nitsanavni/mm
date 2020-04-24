import React, { useState, useEffect } from "react";
import { map, range, isEqual, noop } from "lodash";
import { useInput } from "ink";
import { appendFile, readFileSync, writeFile } from "fs";

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
	deleteSubTree,
	moveLeft,
	moveUp,
	moveDown,
	moveRight,
	toggleExpandCollapse,
	pipe,
	expand,
} from "./outline";
import { OutlineLayout } from "./outline-layout.component";
import { OutlineView } from "./outline-view-mode";
import { PlainOutline } from "./plain-outline";
import { from } from "./plain-from-outline";
import { to } from "./outline-to-plain";

let count = 0;

setInterval(
	() => (
		count > 0 && appendFile("./outline-layout-log", `${count}\n\r`, noop),
		(count = 0)
	),
	1000
);

export const Outline = ({ file }: { file?: string }) => {
	count++;

	const [{ o }, set] = useState(() => {
		let outline = init();

		if (file) {
			try {
				outline = from(readFileSync(file).toString());
			} catch (e) {}
		}

		return { o: outline };
	});

	file && writeFile(file, to(o), noop);

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

		if (tab()) {
			set({ o: { ...addChild()(o), mode: "edit node" } });
		} else if (o.mode === "browse") {
			if (space()) {
				set({ o: { ...toggleExpandCollapse()(o) } });
			} else if (fnBackspace() || input === "d") {
				set({ o: { ...deleteSubTree()(o), mode: "edit node" } });
			} else if (backspace() || altReturn()) {
				set({ o: { ...o, mode: "edit node" } });
			} else if (isEqual(input, "v")) {
				setView(view === "tree" ? "outline" : "tree");
			} else if (key.escape) {
				set({ o: home()(o) });
			} else if (key.downArrow) {
				set({ o: { ...nextSiblin()(o) } });
			} else if (key.upArrow) {
				set({ o: { ...previousSiblin()(o) } });
			} else if (key.leftArrow) {
				set({ o: { ...parent()(o) } });
			} else if (key.rightArrow) {
				set({ o: { ...pipe(o)(expand(), child()) } });
			} else if (key.return) {
				set({ o: { ...addSiblin()(o), mode: "edit node" } });
			} else if (altLeft()) {
				set({ o: { ...moveLeft()(o) } });
			} else if (altRight()) {
				set({ o: { ...moveRight()(o) } });
			} else if (altUp()) {
				set({ o: { ...moveUp()(o) } });
			} else if (altDown()) {
				set({ o: { ...moveDown()(o) } });
			}
		} else {
			if (key.return || key.escape) {
				set({ o: { ...o, mode: "browse" } });
			}
		}

		// console.log(key, input, charCodes);
	});

	return view === "tree" ? (
		<OutlineLayout
			n={o.root}
			onChange={(value) => {
				!value.includes("\t") &&
					!value.includes("[Z") &&
					!value.includes(String.fromCharCode(27)) &&
					set({ ...{ o }, ...{ o: edit(value)(o) } });
			}}
			mode={o.mode}
			prefix={""}
		/>
	) : (
		<PlainOutline n={o.root} />
	);
};
