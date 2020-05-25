import React, { useState } from "react";
import { noop } from "lodash";
import { readFileSync, writeFile } from "fs";

import {
	init,
	edit,
	toggleDeepCollapse,
	pipe,
	Outline as OutlineModel,
} from "./outline";
import { OutlineLayout } from "./outline-layout.component";
import { from } from "./plain-from-outline";
import { to } from "./outline-to-plain";
import { useKey } from "./key.hook";
import { map } from "./key-map";

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

	// TODO - change to `onKey`, makeComponent = (onKey) => (props) => etc.
	useKey((key) => {
		const action = map[o.mode]?.[key];

		if (!action) {
			return;
		}

		const { fn, t, mode } = action;

		if (fn) {
			fn();

			return;
		}

		set({ o: { ...pipe(o)(...(t || [])), mode: mode || o.mode } });
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
