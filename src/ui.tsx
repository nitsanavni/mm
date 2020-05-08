import React from "react";

import { Outline } from "./outline.component";

export const App = ({ file }: { file?: string; help: boolean }) => (
	<Outline file={file} />
);
