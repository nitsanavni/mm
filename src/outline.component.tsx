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
	goToParent,
	child,
	deleteSubTree,
	moveLeft,
	moveUp,
	moveDown,
	moveRight,
	toggleExpandCollapse,
	toggleDeepCollapse,
	pipe,
	expand,
	toggleCollapseLeft,
	Outline as OutlineModel,
} from "./outline";
import { OutlineLayout } from "./outline-layout.component";
import { OutlineView } from "./outline-view-mode";
import { PlainOutline } from "./plain-outline";
import { from } from "./plain-from-outline";
import { to } from "./outline-to-plain";

type Key = "space" | "escape" | "alt return" | "q";

const write = (file: string | undefined, o: OutlineModel) =>
	file && writeFile(file, to(o), noop);

const useMyInput = (handler: (key: Key) => void) => {
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

		// const charCodes = map(range(input.length), (i) => input.charCodeAt(i));

		// TODO - extract controller
		// const tab = () => key.ctrl && isEqual(input, "i");
		// const shiftTab = () => key.meta && isEqual(input, "[Z");
		// const fnBackspace = () => key.meta && isEqual(input, "[3~");
		// const backspace = () => input.charCodeAt(0) === 127;
		// const altLeft = () => isEqual(charCodes, [27, 91, 68]);
		// const altRight = () => isEqual(charCodes, [27, 91, 67]);
		// const altUp = () => isEqual(charCodes, [27, 91, 65]);
		// const altDown = () => isEqual(charCodes, [27, 91, 66]);
		const space = () => isEqual(input, " ");
		// const ctrlSpace = () => isEqual(input, "`") && key.ctrl;
		const altReturn = () => key.meta && input.charCodeAt(0) === 13;
		// const altPoint = () => key.meta && isEqual(input, ".");
		// const altComma = () => key.meta && isEqual(input, ",");
		// const slash = () => isEqual(input, "/");

		if (space()) {
			handler("space");
		} else if (key.escape) {
			handler("escape");
		} else if (altReturn()) {
			handler("alt return");
		} else if (input === "q") {
			handler("q");
		}
	});
};

export const Outline = ({ file }: { file?: string }) => {
	const [{ o }, set] = useState(() => {
		let outline = init();

		if (file) {
			try {
				outline = pipe(from(readFileSync(file).toString()))(
					toggleDeepCollapse()
				);
			} catch (e) {
				// tslint:disable-line
			}
		}

		return { o: outline };
	});

	write(file, o);

	const [view, setView] = useState<OutlineView>("tree");
	// TODO - need more state - in order to do "back" action while navigating

	useMyInput(
		(k) =>
			o.mode === "browse" &&
			{
				space: () => set({ o: { ...toggleExpandCollapse()(o) } }),
				escape: () => set({ o: home()(o) }),
				"alt return": noop,
				q: () => process.exit(),
			}[k]()
	);

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

		const charCodes = map(range(input.length), (i) => input.charCodeAt(i));

		// TODO - extract controller
		const tab = () => key.tab;
		const fnBackspace = () => key.meta && isEqual(input, "[3~");
		const backspace = () => input.charCodeAt(0) === 127;
		const altLeft = () => isEqual(charCodes, [27, 91, 68]);
		const altRight = () => isEqual(charCodes, [27, 91, 67]);
		const altUp = () => isEqual(charCodes, [27, 91, 65]);
		const altDown = () => isEqual(charCodes, [27, 91, 66]);
		const space = () => isEqual(input, " ");
		const ctrlSpace = () => isEqual(input, "`") && key.ctrl;
		const altReturn = () => key.meta && input.charCodeAt(0) === 13;
		const altPoint = () => key.meta && isEqual(input, ".");
		const altComma = () => key.meta && isEqual(input, ",");
		const slash = () => isEqual(input, "/");

		// console.log(input, charCodes, key);

		// TODO - convert if-else to Random Access Object/Array
		if (tab()) {
			set({ o: { ...pipe(o)(expand(), addChild()), mode: "edit node" } });
		} else if (o.mode === "browse") {
			if (slash()) {
				set({ o: { ...o, mode: "search" } });
			} else if (ctrlSpace()) {
				set({ o: { ...toggleDeepCollapse()(o) } });
			} else if (
				altPoint() ||
				altComma() /*TODO - make it smarter than a toggle*/
			) {
				set({ o: { ...toggleCollapseLeft()(o) } });
			} else if (space()) {
				// set({ o: { ...toggleExpandCollapse()(o) } });
			} else if (fnBackspace() || input === "d") {
				set({ o: { ...deleteSubTree()(o) } });
			} else if (backspace() || altReturn()) {
				set({ o: { ...o, mode: "edit node" } });
			} else if (isEqual(input, "v")) {
				setView(view === "tree" ? "outline" : "tree");
			} else if (key.escape) {
				// set({ o: home()(o) });
			} else if (key.downArrow) {
				set({ o: { ...nextSiblin()(o) } });
			} else if (key.upArrow) {
				set({ o: { ...previousSiblin()(o) } });
			} else if (key.leftArrow) {
				set({ o: { ...goToParent()(o) } });
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
			n={o.visibleRoot}
			onChange={(value) =>
				!value.includes("\t") &&
				!value.includes("[Z") &&
				!value.includes(String.fromCharCode(27)) &&
				set({ ...{ o }, ...{ o: edit(value)(o) } })
			}
			mode={o.mode}
			prefix={""}
		/>
	) : (
		<PlainOutline n={o.root} />
	);
};
