import React, { FC } from "react";
import { noop } from "lodash";

import { OutlineLayout } from "./outline-layout.component";
import { init, pipe } from "./outline";
import { clips } from "./clips";

type Clip = "move up";

type P = { clip: Clip };

export const Player: FC<P> = ({ clip }) => {
	return (
		<OutlineLayout
			mode="browse"
			n={pipe(init())(...clips[clip].initialState).visibleRoot}
			onChange={noop}
		/>
	);
};
