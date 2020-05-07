import React, { FC } from "react";
import { noop } from "lodash";

import { OutlineLayout } from "./outline-layout.component";
import { useClip } from "./use-clip";
import { Clip } from "./clip";

type P = { clip: Clip };

export const Player: FC<P> = ({ clip }) => (
	<OutlineLayout mode="browse" n={useClip(clip).visibleRoot} onChange={noop} />
);
