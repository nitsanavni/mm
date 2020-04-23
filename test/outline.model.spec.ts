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
} from "../src/outline";

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
	// t.is(fixture.root.firstChild!.length, 2, msg);
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
});
