import * as React from "react";
import PropTypes from "prop-types";

import { Robot } from "./useinput";

export const App = () => <Robot />;

App.propTypes = {
    name: PropTypes.string
};

App.defaultProps = {
    name: "Stranger"
};
