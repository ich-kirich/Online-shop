const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';

const baseConfig = {
    entry: path.resolve(__dirname, './src/app.ts'),
    mode: 'development',
    devServer: {
        hot: isDev,
        liveReload: true,
        port: 4200,
    },
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader"
                ],
            },
            {
                test: /\.tsx?$/,
                use: ['ts-loader'],
            },
            {
                test: /\.(?:ico|gif|png|jpg|jpeg|svg|webp)$/i,
                loader: 'file-loader',
                options: {
                    outputPath: 'assets/images',
                    name: '[name].[ext]',
                },
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
            filename: 'index.html',
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: 'src/assets/data',
                    to: 'assets/data',
                },
            ],
        }),
    ],
};

module.exports = ({ mode }) => {
    const isProductionMode = mode === 'prod';
    const envConfig = isProductionMode ? require('./webpack.prod.config') : require('./webpack.dev.config');

    return merge(baseConfig, envConfig);
};