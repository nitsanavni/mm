#!/usr/bin/env node
"use strict";
const React = require("react");
const importJsx = require("import-jsx");
const { render } = require("ink");
const meow = require("meow");
const maxListenersExceededWarning = require("max-listeners-exceeded-warning");

maxListenersExceededWarning();
const ui = importJsx("./ui");

const cli = meow(`
	Usage
	  $ mm

	Options
		--name  Your name

	Examples
	  $ mm --name=Jane
	  Hello, Jane
`);

render(React.createElement(ui, cli.flags));
