import { repeat, isEmpty, isNil } from "lodash";

import { Outline, OutlineNode } from "./outline";

const renderNode: (n?: OutlineNode, l?: number) => string = (
	n?: OutlineNode,
	l = 0
) => {
	if (isNil(n)) {
		return "";
	}

	const indent = repeat("  ", l);
	const label = isEmpty(n.label) ? "·" : n.label;
	const newLine = l === 0 ? "" : "\n";

	return (
		newLine +
		indent +
		label +
		renderNode(n.firstChild, l + 1) +
		renderNode(n.nextSiblin, l)
	);
};

export const to = (outline: Outline) => renderNode(outline.root);
