import test from "ava";
import { isEmpty, keys, chain } from "lodash";
import { inspect } from "util";
import { pipe, init, edit, addChild, addSiblin, home } from "../src/outline";

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

test.only("makeFixture", (t) => {
	const fixture = makeFixture();
	const msg = inspect(fixture);

	t.is(fixture.root.label, "root", msg);
	t.is(fixture.root, fixture.focus, msg);
	t.true(!isEmpty(fixture.root.firstChild), msg);
	// t.is(fixture.root.firstChild!.length, 2, msg);
	t.is(keys(fixture.nodes).length, 4, msg);
	t.is(chain(fixture.nodes).keys().uniq().value().length, 4, msg);
});
