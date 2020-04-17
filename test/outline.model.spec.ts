import test from "ava";
import { reduceRight, isNil, reduce, isEmpty, get } from "lodash";
import { inspect } from "util";

type Node = {
	key: string;
	label: string;
	up?: Node;
	down?: Node[];
};

type Root = Omit<Node, "up">;

type Outline = {
	nodes: { [key: string]: Node | Root };
	root: Root;
	focus: Node | Root;
	mode: "edit node" | "browse";
};

type Transform = (o: Outline) => Outline;

const home: () => Transform = () => ({ nodes, root }: Outline) => ({
	nodes,
	root,
	focus: root,
	mode: "browse",
});

const pipe: (o: Outline) => (...t: Transform[]) => Outline = (
	outline: Outline
) => (...transforms: Transform[]) =>
	reduce(transforms, (o, t) => t(o), outline);

let lastKey = 0;

const nextKey = () => {
	lastKey++;

	return `${lastKey}`;
};

const init: () => Outline = () => {
	const key = nextKey();
	const root: Root = { label: "", key };

	return {
		focus: root,
		root,
		nodes: { [key]: root },
		mode: "edit node",
	};
};

const edit: (input: string) => Transform = (input: string) => (o: Outline) => {
	o.focus.label = input;
	o.mode = "browse";

	return o;
};

const emptyNode: (up: Node) => Node = (up: Node) => ({
	key: nextKey(),
	label: "",
	up,
});

const addChild = () => (o: Outline) => {
	const node = emptyNode(o.focus);
	o.focus.down = isNil(o.focus.down) ? [node] : [...o.focus.down, node];
	o.focus = node;
	o.nodes[node.key] = node;

	return o;
};

const addSiblin = () => (o: Outline) => {
	const parent = get(o.focus, "up", o.focus);
	const node = emptyNode(parent);
	parent.down = isNil(parent.down) ? [node] : [...parent.down, node];
	o.focus = node;
	o.nodes[node.key] = node;

	return o;
};

// TODO - fluent api?
const makeFixture = () =>
	pipe(init())(
		edit("root"),
		addChild(),
		edit("child 1"),
		addSiblin(),
		addChild(),
		home()
	);

test("makeFixture", (t) => {
	const fixture = makeFixture();
	const msg = inspect(fixture);

	t.is(fixture.root.label, "root", msg);
	t.is(fixture.root, fixture.focus, msg);
	t.true(!isEmpty(fixture.root.down), msg);
	t.is(fixture.root.down!.length, 2, msg);
	t.is(fixture.root.down!.length, 3, msg);
});
