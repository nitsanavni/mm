import * as React from "react";
import PropTypes from "prop-types";

import { MirrorInput } from "./mirror-input.component";

export const App = () => <MirrorInput />;

App.propTypes = {
	name: PropTypes.string,
};

App.defaultProps = {
	name: "Stranger",
};
