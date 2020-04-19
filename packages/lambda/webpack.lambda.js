const NodemonPlugin = require("nodemon-webpack-plugin");
const path = require("path");
const dotenv = require("dotenv");
const nodeExternals = require("webpack-node-externals");
dotenv.config();

const server = {
  entry: path.resolve(__dirname, "./src/main.ts"),
  mode: process.env.NODE_ENV || "production",
  output: {
    path: path.resolve("./dist"),
    filename: "main.js",
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new NodemonPlugin({
      watch: path.resolve(__dirname, 'dist/main.js'),
      ignore: ['*.js.map'],
      script: path.resolve(__dirname, 'dist/main.js')
    })
  ],
  resolve: {
    extensions: [".ts", ".js", ".json"],
  },
  module: {
    rules: [{ test: /\.tsx?$/, loader: "ts-loader" }],
  },
  externals: [
    nodeExternals({
      modulesDir: path.resolve(__dirname, "../../node_modules"),
    }),
  ],
  devtool: "source-map",
  target: "node",
};

module.exports = server;
