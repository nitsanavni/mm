import React from "react";
import { find } from "lodash";

import { Outline } from "./outline.component";
import { Player } from "./demo";
import { clips } from "./clips";

export const App = ({ file, help }: { file?: string; help: boolean }) => (
	<>
		<Player clip={find(clips, { name: "move up" })!.clip} />
		<Outline file={file} />
	</>
);
