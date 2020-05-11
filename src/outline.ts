import { reduce, get, pullAt, unset, findIndex, first, last } from "lodash";

import { Outline } from "./outline.component";
import { nudgeRight, nudgeLeft } from "./nudge";

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

export type Mode = "edit node" | "browse" | "search";

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
	changeFocusTo(o.visibleRoot)(o);

export const pipe = (outline: Outline) => (...transforms: Transform[]) =>
	reduce(transforms, (o, t) => t(o), outline);

let lastKey = 0;

export const nextKey = () => (lastKey++, `${lastKey}`);

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

export const edit = (input: string) => (o: Outline) => (
	(o.focus.label = input), o
);

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

export const nextSiblin = () => (o: Outline) => (
	!o.visibleRoot.focused && changeFocusTo(o.focus.nextSiblin)(o), o
);

export const previousSiblin = () => (o: Outline) => (
	!o.visibleRoot.focused && changeFocusTo(o.focus.previousSiblin)(o), o
);

export const goToParent = () => (o: Outline) => (
	!o.visibleRoot.focused && changeFocusTo(getParent(o.focus))(o), o
);

export const child = () => (o: Outline) => changeFocusTo(o.focus.firstChild)(o);

export const expand = () => (o: Outline) => ((o.focus.collapsed = false), o);

export const toggleExpandCollapse = () => (o: Outline) => (
	(o.focus.collapsed = !!o.focus.firstChild && !o.focus.collapsed), o
);

const deep = (
	root: OutlineNode | undefined,
	visit: (n: OutlineNode) => void
) => {
	if (!root) {
		return;
	}

	visit(root);
	deep(root.firstChild, visit);
	deep(root.nextSiblin, visit);
};

export const toggleDeepCollapse = () => (o: Outline) => (
	((collapsed: boolean) =>
		deep(o.focus, (n) => (n.collapsed = n.firstChild && collapsed)))(
		!o.focus.collapsed
	),
	o
);

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
		goToParent()(o);
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

export const siblinArray = (n?: OutlineNode) => {
	if (!n) {
		return [];
	}

	return childrenArray(n.parent);
};

export const childrenArray = (p?: OutlineNode) => {
	if (!p) {
		return [];
	}

	let it = p.firstChild;

	const ret = [];

	while (it) {
		ret.push(it);
		it = it.nextSiblin;
	}

	return ret;
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

	nudgeLeft(array, pos);

	connect(array);

	return o;
};

export const moveDown = () => (o: Outline) => {
	const f = o.focus as OutlineNode;
	const array = siblinArray(f);

	const pos = findIndex(array, (n) => n.focused);

	nudgeRight(array, pos);

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

	if (newParent?.collapsed) {
		changeFocusTo(newParent)(o);
	}

	return o;
};

export const moveLeft = () => (o: Outline) => {
	// root
	if (o.root.focused) {
		return o;
	}

	const n = o.focus as OutlineNode;

	// direct child of root, also cannot move left
	if (n.parent?.key === o.root.key) {
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
