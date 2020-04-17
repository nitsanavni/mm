#!/usr/bin/env node
import * as React from "react";
import { render } from "ink";
import { EventEmitter } from "events";

import { App } from "./ui";

// each TextInput component is listening on stdin.on("data")
EventEmitter.defaultMaxListeners = 70;

render(<App />);
