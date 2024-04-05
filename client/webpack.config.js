const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const EslintWebpackPlugin = require("eslint-webpack-plugin");
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const extensions = [".js", ".jsx"];

module.exports = {
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  entry: "./src/index.jsx",
  output: {
    path: `${__dirname}/build`,
    filename: "bundle.js",
    publicPath: "/",
  },
  resolve: {
    extensions,
    alias: {
      "@/components": path.resolve(__dirname, "components"),
      "@/lib": path.resolve(__dirname, "lib"),
    },
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "build"),
    },
    client: {
      overlay: false,
    },
    compress: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [["@babel/preset-react", { runtime: "automatic" }]],
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  plugins: [
    new EslintWebpackPlugin({ extensions }),
    new HtmlWebpackPlugin({
      template: "./build/index.html",
      favicon: "./build/favicon.ico",
    }),
    new BundleAnalyzerPlugin()
  ],
  stats: "minimal",
};
