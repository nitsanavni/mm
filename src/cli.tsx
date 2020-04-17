#!/usr/bin/env node
import * as React from "react";
import { render } from "ink";
import meow from "meow";
// const maxListenersExceededWarning = require("max-listeners-exceeded-warning");
import { EventEmitter } from "events";
EventEmitter.defaultMaxListeners = 300;

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
