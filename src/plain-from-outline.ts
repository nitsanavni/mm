import { split, reduce, trim, times } from "lodash";

import {
	goToParent,
	init,
	pipe,
	Transform,
	edit,
	addChild,
	addSiblin,
	home,
} from "./outline";

export const from = (plain: string) => {
	const lines = split(plain, "\n");
	const o = init();

	let previousIndent = 0;

	return pipe(o)(
		...reduce(
			lines,
			(acc, line) => {
				const currentIndent = indent(line);

				if (currentIndent === 0) {
					// root - don't add node
				} else if (currentIndent > previousIndent) {
					acc.push(addChild());
				} else {
					times(previousIndent - currentIndent, () => acc.push(goToParent()));
					acc.push(addSiblin());
				}

				previousIndent = currentIndent;

				return [...acc, edit(stripIndent(line))];
			},
			[] as Transform[]
		),
		home()
	);
};

export const indent = (line: string) =>
	/^( *)([^ ]*)/.exec(line)?.[1].length! / 2 || 0;

export const stripIndent = trim;
