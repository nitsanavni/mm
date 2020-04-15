"use strict";
const React = require("react");
const PropTypes = require("prop-types");
const { Text, Color, StdinContext } = require("ink");
const importJsx = require("import-jsx");

const Robot = importJsx("./useinput");

const App = () => <Robot />;

App.propTypes = {
	name: PropTypes.string,
};

App.defaultProps = {
	name: "Stranger",
};

module.exports = App;
