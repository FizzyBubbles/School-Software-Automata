const path = require("path");

module.exports = {
  entry: "./game.ts",
  mode: "development",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts"],
  },
  output: {
    filename: "game.js",
    path: path.resolve(__dirname, "build"),
  },
};
