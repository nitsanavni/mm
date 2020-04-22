import React from "react";
import { render } from "ink-testing-library";

import { Outline } from "../src/outline";
import { PlainOutline } from "../src/plain-outline";

export const to = (o: Outline) =>
	render(<PlainOutline n={o.root} />).lastFrame();
