import test from "ava";
import { isEmpty, keys, chain } from "lodash";
import { inspect } from "util";
import {
	pipe,
	init,
	edit,
	addChild,
	addSiblin,
	home,
	child,
	moveUp,
	moveLeft,
	nextSiblin,
	moveRight,
	moveDown,
	deleteSubTree,
} from "../src/outline";
import { to } from "../src/outline-to-plain";

// TODO - fluent api?
const makeFixture = () =>
	pipe(init())(
		edit("root"),
		addChild(),
		edit("child 1"),
		addSiblin(),
		edit("child 2"),
		addChild(),
		home()
	);

test("makeFixture", (t) => {
	const fixture = makeFixture();
	const msg = inspect(fixture);

	t.is(fixture.root.label, "root", msg);
	t.is(fixture.root, fixture.focus, msg);
	t.true(!isEmpty(fixture.root.firstChild), msg);
	t.is(keys(fixture.nodes).length, 4, msg);
	t.is(chain(fixture.nodes).keys().uniq().value().length, 4, msg);
});

test("moveUp", (t) => {
	const fixture = makeFixture();

	t.is(fixture.root.firstChild?.label, "child 1");
	t.is(fixture.root.lastChild?.label, "child 2");

	pipe(fixture)(child(), moveUp());

	// notice the reverse order
	t.is(fixture.root.firstChild?.label, "child 2");
	t.is(fixture.root.lastChild?.label, "child 1");

	pipe(fixture)(child(), moveUp());
	t.is(fixture.root.firstChild?.label, "child 1");
	t.is(fixture.root.lastChild?.label, "child 2");
});

test("moving", (t) => {
	const o = pipe(init())(
		edit("1"),
		addChild(),
		edit("2"),
		addSiblin(),
		edit("3"),
		addChild(),
		edit("X")
	);

	t.is(to(o), "1\n  2\n  3\n    X");

	t.is(to(moveLeft()(o)), "1\n  2\n  3\n  X");
	t.is(to(moveUp()(o)), "1\n  2\n  X\n  3");
	t.is(to(moveRight()(o)), "1\n  2\n    X\n  3");
	t.is(to(moveLeft()(o)), "1\n  2\n  X\n  3");
	t.is(to(moveUp()(o)), "1\n  X\n  2\n  3");
	t.is(to(moveRight()(o)), "1\n  2\n    X\n  3");
	t.is(to(moveLeft()(o)), "1\n  2\n  X\n  3");
	t.is(to(moveDown()(o)), "1\n  2\n  3\n  X");
});

test("deleteSubTree", (t) => {
	t.is(
		to(pipe(makeFixture())(child(), nextSiblin(), deleteSubTree())),
		"root\n  child 1"
	);
});
