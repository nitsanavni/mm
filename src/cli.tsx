#!/usr/bin/env node
import * as React from "react";
import { render } from "ink";
import meow from "meow";

import { App } from "./ui";
import { clearScreen } from "./clear-screen";

const cli = meow({ flags: { file: { type: "string", alias: "f" } } });

clearScreen();

render(<App file={cli.flags.file || cli.input[0]} />);
