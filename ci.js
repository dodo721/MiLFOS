const webpack = require("webpack");
const fs = require("fs");
const configs = require("./webpack.config.js");

const compiler = webpack(configs);

console.log("Beginning watch...");

const watching = compiler.watch(
	{},
	(err, stats) => {
		console.log(stats.toString());
		err && console.error(err.toString());
		fs.writeFile("./web/webpacklog.txt", stats.toString(), err => console.error(err));
	}
);
