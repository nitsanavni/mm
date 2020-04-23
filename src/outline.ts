import { reduce, get, isNil, pullAt, unset } from "lodash";
import { Outline } from "./outline.component";

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

export const moveUp = () => (o: Outline) => {
	// root
	if (o.root.focused) {
		return o;
	}

	// our participants
	const f = o.focus as OutlineNode;
	const parent = f.parent;
	const p = f.previousSiblin;
	const pp = p?.previousSiblin;
	const n = f.nextSiblin;
	const l = parent?.lastChild;

	// pp,p,f,n,l -> pp,f,p,n,l - first last children unchanged
	// p,f,n,l -> f,p,n,l - first child changed
	// ok let's convert to array, swap, and then, restore the links

	if (p) {
		// pp,p,f,n -> pp,f,p,n
		if (pp) {
		} else {
			// parent.firstChild
		}
	} else if (n) {
		// fnl -> nlf
	} else {
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
		n.nextSiblin = n.parent.nextSiblin;
		n.parent.nextSiblin.previousSiblin = n;
	} else {
		n.parent!.parent!.lastChild = n;
	}

	n.previousSiblin = n.parent;
	n.parent!.nextSiblin = n;
	n.parent = n.parent?.parent;

	return o;
};
