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
import { from } from "./plain-from-outline";
import { to } from "./outline-to-plain";
import { useKey } from "./key.hook";

const write = (file: string | undefined, o: OutlineModel) =>
	file && writeFile(file, to(o), noop);

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

	useKey(
		(key) =>
			o.mode === "browse" &&
			(
				({
					up: () => set({ o: { ...previousSiblin()(o) } }),
					down: () => set({ o: { ...nextSiblin()(o) } }),
					left: () => set({ o: { ...goToParent()(o) } }),
					right: () => set({ o: { ...pipe(o)(expand(), child()) } }),
					space: () => set({ o: { ...toggleExpandCollapse()(o) } }),
					return: () => set({ o: { ...addSiblin()(o), mode: "edit node" } }),
					escape: () => set({ o: home()(o) }),
					q: () => process.exit(),
					"ctrl space": () => set({ o: { ...toggleDeepCollapse()(o) } }),
					"alt point": () => set({ o: { ...toggleCollapseLeft()(o) } }),
					"alt comma": () => set({ o: { ...toggleCollapseLeft()(o) } }),
					"fn backspace": () => set({ o: { ...deleteSubTree()(o) } }),
					d: () => set({ o: { ...deleteSubTree()(o) } }),
					"alt return": () => set({ o: { ...o, mode: "edit node" } }),
					backspace: () => set({ o: { ...o, mode: "edit node" } }),
					unrecognized: noop,
				} as any)[key] || noop
			)()
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

		const tab = () => key.ctrl && isEqual(input, "i");
		const altLeft = () => isEqual(charCodes, [27, 91, 68]);
		const altRight = () => isEqual(charCodes, [27, 91, 67]);
		const altUp = () => isEqual(charCodes, [27, 91, 65]);
		const altDown = () => isEqual(charCodes, [27, 91, 66]);

		if (tab()) {
			set({ o: { ...pipe(o)(expand(), addChild()), mode: "edit node" } });
		} else if (o.mode === "browse") {
			if (altLeft()) {
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

	return (
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
	);
};
