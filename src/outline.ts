import { reduce, get, isNil } from "lodash";

// TODO
// - extract some methods
// - `traverse` / `visit`

export type OutlineNode = {
	key: string;
	label: string;
	focused: boolean;
	up?: OutlineNode;
	down?: OutlineNode[];
};

export type Root = Omit<OutlineNode, "up">;

export type Outline = {
	nodes: { [key: string]: OutlineNode | Root };
	root: Root;
	focus: OutlineNode | Root;
	mode: "edit node" | "browse";
};

export type Transform = (o: Outline) => Outline;

export const home: () => Transform = () => ({ nodes, root }: Outline) => ({
	nodes,
	root,
	focus: root,
	mode: "browse",
});

export const pipe: (o: Outline) => (...t: Transform[]) => Outline = (
	outline: Outline
) => (...transforms: Transform[]) =>
	reduce(transforms, (o, t) => t(o), outline);

let lastKey = 0;

export const nextKey = () => {
	lastKey++;

	return `${lastKey}`;
};

export const init: () => Outline = () => {
	const key = nextKey();
	const root: Root = { label: "", key, focused: true };

	return {
		focus: root,
		root,
		nodes: { [key]: root },
		mode: "edit node",
	};
};

export const edit: (input: string) => Transform = (input: string) => (
	o: Outline
) => {
	o.focus.label = input;
	o.mode = "browse";

	return o;
};

export const emptyNode: (up: OutlineNode) => OutlineNode = (
	up: OutlineNode
) => ({
	key: nextKey(),
	label: "",
	up,
	focused: false,
});

export const addChild = () => (o: Outline) => {
	const node = emptyNode(o.focus);
	o.focus.down = isNil(o.focus.down) ? [node] : [...o.focus.down, node];
	o.focus.focused = false;
	o.focus = node;
	o.focus.focused = true;
	o.nodes[node.key] = node;

	return o;
};

export const addSiblin = () => (o: Outline) => {
	const parent = get(o.focus, "up", o.focus);
	const node = emptyNode(parent);
	parent.down = isNil(parent.down) ? [node] : [...parent.down, node];
	// extract `changeFocusTo(node)`
	o.focus.focused = false;
	o.focus = node;
	o.focus.focused = true;
	o.nodes[node.key] = node;

	return o;
};
