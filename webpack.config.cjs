/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
    entry: "./src/index.ts",
    mode: "development",
    devtool: "source-map",

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: "ts-loader",
                    options: {
                        configFile: "tsconfig.webpack.json",
                    },
                },
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(glsl|svg|kicad_wks)$/,
                type: "asset/source",
            },
        ],
    },

    resolve: {
        extensions: [".tsx", ".ts", ".js", ".jsx"],
    },

    output: {
        filename: "kicanvas.js",
        path: path.resolve(__dirname, "debug/kicanvas"),
        library: {
            type: "module",
        },
        clean: true,
    },

    experiments: {
        outputModule: true,
    },

    devServer: {
        static: {
            directory: path.join(__dirname, "debug"),
        },
        port: 8001,
        hot: true,
        open: false,
    },

    plugins: [
        new webpack.DefinePlugin({
            DEBUG: "true",
        }),
        new HtmlWebpackPlugin({
            template: "debug/template.html",
            filename: "../index.html",
            inject: false,
        }),
    ],
};
