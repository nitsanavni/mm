import { reduce, get, isNil } from "lodash";

// TODO
// - extract some methods
// - `traverse` / `visit`

export type OutlineNode = {
	key: string;
	label: string;
	focused: boolean;
	parent?: OutlineNode;
	firstChild?: OutlineNode;
	lastChild?: OutlineNode;
	nextSiblin?: OutlineNode;
	previousSiblin?: OutlineNode;
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

const changeFocusTo = (n?: OutlineNode) => (o: Outline) => {
	if (!n) {
		return o;
	}

	o.focus.focused = false;
	o.focus = n;
	o.focus.focused = true;
	o.mode = "browse";

	return o;
};

const getParent = (n: OutlineNode) => get(n, "parent", n);

export const home: () => Transform = () => (o: Outline) =>
	changeFocusTo(o.root)(o);

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

const addNodeUnder = (parent: OutlineNode) => (o: Outline) => {
	const node = emptyNode(parent);

	if (parent.lastChild) {
		parent.lastChild.nextSiblin = node;
		node.previousSiblin = parent.lastChild;
	}
	parent.lastChild = node;
	parent.firstChild = parent.firstChild || node;
	o.nodes[node.key] = node;

	changeFocusTo(node)(o);

	return o;
};

export const addChild = () => (o: Outline) => addNodeUnder(o.focus)(o);

export const addSiblin = () => (o: Outline) =>
	addNodeUnder(getParent(o.focus))(o);

export const nextSiblin = () => (o: Outline) =>
	changeFocusTo(o.focus.nextSiblin)(o);

export const previousSiblin = () => (o: Outline) =>
	changeFocusTo(o.focus.previousSiblin)(o);

export const parent = () => (o: Outline) =>
	changeFocusTo(getParent(o.focus))(o);

export const child = () => (o: Outline) => changeFocusTo(o.focus.firstChild)(o);
