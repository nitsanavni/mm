#!/usr/bin/env node
import * as React from "react";
import { render } from "ink";
import meow from "meow";

import { App } from "./ui";

const cli = meow(`
	Usage
	  $ mm

	Options
		--name  Your name

	Examples
	  $ mm --name=Jane
	  Hello, Jane
`);

render(React.createElement(App, cli.flags));
