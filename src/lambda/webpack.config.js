const NodemonPlugin = require("nodemon-webpack-plugin");
const path = require("path");
const dotenv = require("dotenv");
const nodeExternals = require("webpack-node-externals");
dotenv.config();

const server = {
  entry: path.resolve("./src/lambda/src/main.ts"),
  mode: process.env.NODE_ENV || "production",
  output: {
    path: path.resolve("./src/lambda/dist"),
    filename: "main.js",
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new NodemonPlugin({
      nodeArgs: [
        "-r",
        "dotenv/config",
        "-r",
        "source-map-support/register",
        ...(process.env.DEBUG === "true" ? ["--inspect-brk"] : []),
      ],
      script: "./src/lambda/dist/main.js",
      outDir: "dist",
    }),
  ],
  resolve: {
    extensions: [".ts", ".js", ".json"],
    // modules: [path.resolve("./lambda"), 'node_modules']
  },
  module: {
    rules: [{ test: /\.tsx?$/, loader: "ts-loader" }],
  },
  externals: [
    nodeExternals({
      modulesDir: path.resolve("./src/lambda/node_modules"),
    }),
  ],
  devtool: "source-map",
  target: "node",
};

module.exports = server;
