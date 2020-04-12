const NodemonPlugin = require("nodemon-webpack-plugin");
const path = require("path");
const dotenv = require("dotenv");
const nodeExternals = require("webpack-node-externals");
dotenv.config();

const server = {
  entry: path.resolve("./functions/src/main.ts"),
  mode: process.env.NODE_ENV || "production",
  output: {
    path: path.resolve("./functions/dist"),
    filename: "graphql.js",
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
      script: "./functions/dist/graphql.js",
      outDir: "dist",
    }),
  ],
  resolve: {
    extensions: [".ts", ".js", ".json"],
    // modules: [path.resolve("./functions"), 'node_modules']
  },
  module: {
    rules: [{ test: /\.tsx?$/, loader: "ts-loader" }],
  },
  externals: [
    nodeExternals({
      modulesDir: path.resolve("./functions/node_modules"),
    }),
  ],
  devtool: "source-map",
  target: "node",
};

module.exports = server;
