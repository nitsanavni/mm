import { reduce, get, isNil } from "lodash";

// TODO
// - extract some methods
// - `traverse` / `visit`

export type OutlineNode = {
	key: string;
	label: string;
	focused: boolean;
	parent?: OutlineNode;
	children?: OutlineNode[];
};

export type Root = Omit<OutlineNode, "parent">;

export type Mode = "edit node" | "browse";

export type Outline = {
	nodes: { [key: string]: OutlineNode | Root };
	root: Root;
	focus: OutlineNode | Root;
	mode: Mode;
};

export type Transform = (o: Outline) => Outline;

export const home: () => Transform = () => (o: Outline) => {
	o.focus.focused = false;
	o.focus = o.root;
	o.focus.focused = true;
	o.mode = "browse";

	return o;
};

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

	return o;
};

export const emptyNode: (parent: OutlineNode) => OutlineNode = (
	parent: OutlineNode
) => ({
	key: nextKey(),
	label: "",
	parent,
	focused: false,
});

export const addChild = () => (o: Outline) => {
	const node = emptyNode(o.focus);
	o.focus.children = isNil(o.focus.children)
		? [node]
		: [...o.focus.children, node];
	o.focus.focused = false;
	o.focus = node;
	o.focus.focused = true;
	o.nodes[node.key] = node;

	return o;
};

export const addSiblin = () => (o: Outline) => {
	const parent: OutlineNode = get(o.focus, "parent", o.focus);
	const node = emptyNode(parent);
	parent.children = isNil(parent.children)
		? [node]
		: [...parent.children, node];
	// extract `changeFocusTo(node)`
	o.focus.focused = false;
	o.focus = node;
	o.focus.focused = true;
	o.nodes[node.key] = node;

	return o;
};

export const nextSiblin = () => (o: Outline) => {
	return o;
};
