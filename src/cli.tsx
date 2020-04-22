#!/usr/bin/env node
import * as React from "react";
import { render } from "ink";
import meow from "meow";

import { App } from "./ui";

const cli = meow({ flags: { file: { type: "string", alias: "f" } } });

render(<App file={cli.flags.file || cli.input[0]} />);
