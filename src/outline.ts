import { reduce, get, pullAt, unset, findIndex, first, last } from "lodash";
import { Outline } from "./outline.component";

// TODO
// - extract some methods
// - `traverse` / `visit`

export type OutlineNode = {
	key: string;
	label: string;
	focused: boolean;
	collapsed?: boolean;
	collapsedLeft?: boolean;
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
	visibleRoot: OutlineNode | Root;
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
	const root: Root = { label: "", key, focused: true, collapsed: false };

	return {
		focus: root,
		root,
		visibleRoot: root,
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
	collapsed: false,
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

export const expand = () => (o: Outline) => ((o.focus.collapsed = false), o);

export const toggleExpandCollapse = () => (o: Outline) => {
	if (o.focus.collapsed) {
		o.focus.collapsed = false;
	} else {
		o.focus.collapsed = !!o.focus.firstChild;
	}

	return o;
};

const findInLineage = (
	n: OutlineNode | undefined,
	p: (a?: OutlineNode) => boolean | undefined
) => {
	do {
		n = n?.parent;
	} while (!p(n));

	return n;
};

export const toggleCollapseLeft = () => (o: Outline) => {
	const n = o.focus;

	if (n.collapsedLeft) {
		n.collapsedLeft = false;
		o.visibleRoot = findInLineage(n, (a) => a?.collapsedLeft || !a?.parent)!;
	} else if (!o.root.focused) {
		n.collapsedLeft = true;
		o.visibleRoot = n;
	}

	return o;
};

export const deleteSubTree = () => (o: Outline) => {
	if (o.root.focused) {
		return o;
	}

	const target = o.focus;

	if (target.nextSiblin) {
		nextSiblin()(o);
	} else if (target.previousSiblin) {
		previousSiblin()(o);
	} else {
		parent()(o);
	}

	const remove = (n?: OutlineNode) => {
		if (!n) {
			return;
		}

		// TODO - extract this traverse
		let next = n.firstChild;

		while (next) {
			remove(next);
			next = next.nextSiblin;
		}

		// will it work?
		unset(o.nodes, n.key);

		if (n.previousSiblin) {
			n.previousSiblin.nextSiblin = n.nextSiblin;
		} else {
			n.parent!.firstChild = n.nextSiblin;
		}

		if (n.nextSiblin) {
			n.nextSiblin.previousSiblin = n.previousSiblin;
		} else {
			n.parent!.lastChild = n.previousSiblin;
		}
	};

	remove(target);

	return o;
};

const siblinArray = (n?: OutlineNode) => {
	if (!n) {
		return [];
	}

	const p = n.parent;

	if (!p) {
		return [n];
	}

	let it = p.firstChild;

	const ret = [];

	while (it) {
		ret.push(it);
		it = it.nextSiblin;
	}

	return ret;
};

const swap = <T>(array: T[], i: number, j: number) => {
	// https://stackoverflow.com/questions/872310/javascript-swap-array-elements
	[array[i], array[j]] = [array[j], array[i]];
};

const connect = (siblins: OutlineNode[]) => {
	const f = first(siblins)!;
	const l = last(siblins)!;
	const parent = f.parent!;

	f.previousSiblin = undefined;
	l.nextSiblin = undefined;

	parent.firstChild = f;
	parent.lastChild = l;

	reduce(siblins, (prev, curr) => {
		prev.nextSiblin = curr;
		curr.previousSiblin = prev;

		return curr;
	});
};

export const moveUp = () => (o: Outline) => {
	const f = o.focus as OutlineNode;
	const array = siblinArray(f);

	const pos = findIndex(array, (n) => n.focused);
	const newPos = pos > 0 ? pos - 1 : array.length - 1;
	swap(array, pos, newPos);
	connect(array);

	return o;
};

export const moveDown = () => (o: Outline) => {
	const f = o.focus as OutlineNode;
	const array = siblinArray(f);

	const pos = findIndex(array, (n) => n.focused);
	const newPos = pos < array.length - 1 ? pos + 1 : 0;
	swap(array, pos, newPos);
	connect(array);

	return o;
};

export const moveRight = () => (o: Outline) => {
	const f = o.focus as OutlineNode;

	if (!f.previousSiblin && !f.nextSiblin) {
		// nowhere to move
		return o;
	}

	const oldSiblins = siblinArray(f);
	pullAt(
		oldSiblins,
		findIndex(oldSiblins, (s) => s.focused)
	);

	const newParent = f.previousSiblin || f.nextSiblin;
	f.parent = newParent;
	f.previousSiblin = undefined;
	f.nextSiblin = undefined;

	const newSiblins = [...siblinArray(newParent?.firstChild), f];

	connect(oldSiblins);
	connect(newSiblins);

	return o;
};

export const moveLeft = () => (o: Outline) => {
	// root
	if (o.root.focused) {
		return o;
	}

	const n = o.focus as OutlineNode;

	// direct child of root, also cannot move left
	if (n.parent?.key == o.root.key) {
		return o;
	}

	if (n.previousSiblin) {
		n.previousSiblin.nextSiblin = n.nextSiblin;
	} else {
		n.parent!.firstChild = n.nextSiblin;
	}

	if (n.nextSiblin) {
		n.nextSiblin.previousSiblin = n.previousSiblin;
	} else {
		n.parent!.lastChild = n.previousSiblin;
	}

	if (n.parent?.nextSiblin) {
		n.parent.nextSiblin.previousSiblin = n;
	} else {
		n.parent!.parent!.lastChild = n;
	}

	n.nextSiblin = n.parent!.nextSiblin;
	n.previousSiblin = n.parent;
	n.parent!.nextSiblin = n;
	n.parent = n.parent?.parent;

	return o;
};
