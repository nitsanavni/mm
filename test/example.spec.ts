import test from "ava";
import { example } from "../src/example";

test("'example' stays 'example'", (t) => {
    t.plan(1);
    t.is(example, "example");
});
